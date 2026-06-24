import { useState } from 'react'
import type { Message, MessageBubbleLabels } from '../../types'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: Message
  labels?: MessageBubbleLabels
}

export function MessageBubble({ message, labels }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const [thinkingOpen, setThinkingOpen] = useState(false)

  const agentName = labels?.agentName ?? 'Agent'
  const thinkingToggleLabel = labels?.thinkingToggle ?? 'Thinking process'

  return (
    <div className={`${styles.wrap} ${isUser ? styles['wrap--user'] : ''}`}>
      {!isUser && (
        <div className={styles.meta}>
          <span>{agentName}</span>
          <span>{time}</span>
        </div>
      )}
      {!isUser && message.thinking && (
        <div className={styles.thinking}>
          <button
            className={styles['thinking-toggle']}
            onClick={() => setThinkingOpen((o) => !o)}
            aria-expanded={thinkingOpen}
          >
            <span className={`${styles['thinking-arrow']} ${thinkingOpen ? styles['thinking-arrow--open'] : ''}`}>▶</span>
            {thinkingToggleLabel}
          </button>
          {thinkingOpen && (
            <pre className={styles['thinking-content']}>{message.thinking}</pre>
          )}
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles['bubble--user'] : styles['bubble--assistant']}`}>
        {message.content || <span style={{ opacity: 0.4 }}>…</span>}
      </div>
      {isUser && (
        <div className={`${styles.meta}`} style={{ alignSelf: 'flex-end' }}>
          <span>{time}</span>
        </div>
      )}
    </div>
  )
}
