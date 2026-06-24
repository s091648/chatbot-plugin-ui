import { TerminalIcon } from '../../icons'
import type { Message, ToolCallBlockLabels } from '../../types'
import styles from './ToolCallBlock.module.css'

interface ToolCallBlockProps {
  message: Message
  labels?: ToolCallBlockLabels
}

export function ToolCallBlock({ message, labels }: ToolCallBlockProps) {
  const { toolCall, toolResult } = message
  if (!toolCall) return null

  const toolPrefix = labels?.toolPrefix ?? 'MCP Tool: '
  const statusRunning = labels?.statusRunning ?? 'Running'
  const statusDone = labels?.statusDone ?? 'Executed'
  const statusError = labels?.statusError ?? 'Error'

  const status = toolResult ? (toolResult.isError ? 'error' : 'done') : 'running'
  const statusLabel = { running: statusRunning, done: statusDone, error: statusError }[status]

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <TerminalIcon size={16} />
          <span className={styles.title}>{toolPrefix}{toolCall.name}</span>
        </div>
        <span className={`${styles.status} ${styles[`status--${status}`]}`}>{statusLabel}</span>
      </div>
      <code className={styles.code}>{JSON.stringify(toolCall.arguments, null, 2)}</code>
      {toolResult && <p className={styles.resultText}>{toolResult.content}</p>}
    </div>
  )
}
