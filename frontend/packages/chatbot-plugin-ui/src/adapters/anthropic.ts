import type { StreamAdapter, Message, RequestOptions, StreamEvent } from '../types'

export const anthropicAdapter: StreamAdapter = {
  buildRequest(messages: Message[], options: RequestOptions): RequestInit {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role === 'tool' ? 'user' : m.role,
          content: m.content,
        })),
        stream: true,
      }),
    }
  },

  parse(line: string): StreamEvent | null {
    if (!line.startsWith('data: ')) return null
    const data = line.slice(6).trim()

    try {
      const json = JSON.parse(data)

      if (json.type === 'content_block_delta') {
        const delta = json.delta
        if (delta?.type === 'text_delta' && typeof delta.text === 'string') {
          return { type: 'text_delta', content: delta.text }
        }
        if (delta?.type === 'thinking_delta' && typeof delta.thinking === 'string') {
          return { type: 'thinking_delta', content: delta.thinking }
        }
      }

      if (json.type === 'content_block_start') {
        const block = json.content_block
        if (block?.type === 'tool_use') {
          return {
            type: 'tool_call_start',
            tool: {
              id: block.id ?? crypto.randomUUID(),
              name: block.name,
              arguments: {},
            },
          }
        }
      }

      if (json.type === 'message_stop') {
        return { type: 'done' }
      }

      if (json.type === 'error') {
        return { type: 'error', error: json.error?.message ?? 'Unknown error' }
      }

      return null
    } catch {
      return null
    }
  },
}
