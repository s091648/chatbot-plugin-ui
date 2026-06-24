import { useState, useRef, type KeyboardEvent } from 'react'
import '../../styles/base.css'
import { SearchIcon, SendIcon } from '../../icons'
import { ToolCallCard } from './ToolCallCard'
import type { AgentInputProps } from '../../types'
import styles from './AgentInput.module.css'

function createInputHistory() {
  const history: string[] = []
  let index = -1
  let draft = ''

  return {
    push(text: string) {
      if (text && history[0] !== text) history.unshift(text)
      index = -1
      draft = ''
    },
    prev(current: string): string | null {
      if (history.length === 0) return null
      if (index === -1) draft = current
      const next = index + 1
      if (next >= history.length) return null
      index = next
      return history[index]
    },
    next(): string {
      if (index <= 0) {
        index = -1
        return draft
      }
      index--
      return history[index]
    },
  }
}

export function AgentInput({
  onSend,
  isLoading = false,
  messages = [],
  theme = 'auto',
  className = '',
  placeholder = 'Ask the AI agent...',
  suggestions = [],
  onSuggestionClick,
  sendIcon,
  searchIcon,
  labels,
}: AgentInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef(createInputHistory())

  const inputAriaLabel = labels?.inputAriaLabel ?? 'Agent input'
  const sendAriaLabel = labels?.sendAriaLabel ?? 'Send'
  const sendLabel = labels?.send ?? 'Run'
  const sendLoadingLabel = labels?.sendLoading ?? 'Running...'

  const handleSend = () => {
    const text = value.trim()
    if (!text || isLoading) return
    historyRef.current.push(text)
    onSend(text)
    setValue('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = historyRef.current.prev(value)
      if (prev !== null) setValue(prev)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setValue(historyRef.current.next())
    }
  }

  const toolMessages = messages.filter((m) => m.role === 'tool')

  return (
    <div data-chatbot-theme={theme} className={`${styles.root} ${className}`}>
      <div className={styles.rainbowWrap}>
        <div className={styles.inputInner}>
          <span className={styles.iconSlot}>
            {searchIcon ?? <SearchIcon size={20} />}
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            disabled={isLoading}
            aria-label={inputAriaLabel}
          />
          <div className={styles.actions}>
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={isLoading || !value.trim()}
              aria-label={sendAriaLabel}
            >
              {sendIcon ?? <SendIcon size={16} />}
              {isLoading ? sendLoadingLabel : sendLabel}
            </button>
          </div>
        </div>
      </div>

      {toolMessages.length > 0 && (
        <div className={styles.toolCallsArea}>
          {toolMessages.map((m) => (
            <ToolCallCard key={m.id} message={m} defaultOpen labels={labels?.toolCallCard} />
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <button
              key={s}
              className={styles.chip}
              onClick={() => {
                onSuggestionClick ? onSuggestionClick(s) : onSend(s)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
