import { useState } from 'react'
import { TerminalIcon, ChevronDownIcon } from '../../icons'
import type { Message, ToolCallCardLabels } from '../../types'
import styles from './ToolCallCard.module.css'

interface ToolCallCardProps {
  message: Message
  defaultOpen?: boolean
  labels?: ToolCallCardLabels
}

export function ToolCallCard({ message, defaultOpen = false, labels }: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { toolCall, toolResult } = message

  if (!toolCall) return null

  const statusRunning = labels?.statusRunning ?? 'Running'
  const statusDone = labels?.statusDone ?? 'Done'
  const statusError = labels?.statusError ?? 'Error'

  const status = toolResult
    ? toolResult.isError
      ? 'error'
      : 'done'
    : 'running'

  const badgeLabel = { running: statusRunning, done: statusDone, error: statusError }[status]

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setOpen((v) => !v)} role="button" aria-expanded={open}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <TerminalIcon size={16} />
          </div>
          <span className={styles.name}>{toolCall.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`${styles.badge} ${styles[`badge--${status}`]}`}>{badgeLabel}</span>
          <div className={`${styles.chevron} ${open ? styles['chevron--open'] : ''}`}>
            <ChevronDownIcon size={16} />
          </div>
        </div>
      </div>
      {open && (
        <div className={styles.body}>
          <code className={styles.code}>{JSON.stringify(toolCall.arguments, null, 2)}</code>
          {toolResult && (
            <p className={styles.result}>{toolResult.content}</p>
          )}
        </div>
      )}
    </div>
  )
}
