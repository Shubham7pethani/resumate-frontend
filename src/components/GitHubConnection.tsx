import React from 'react'
import ConnectionCard from './ConnectionCard'
import { useConnections } from '@/hooks/useConnections'

interface GitHubConnectionProps {
  onConnectionChange?: (connected: boolean) => void
}

export default function GitHubConnection({ onConnectionChange }: GitHubConnectionProps) {
  const { connections, actions } = useConnections()
  
  // Notify parent of connection changes (avoid infinite loops by not depending on callback identity)
  React.useEffect(() => {
    onConnectionChange?.(connections.github.connected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections.github.connected])

  return (
    <ConnectionCard
      platform="github"
      connected={connections.github.connected}
      username={connections.github.username}
      loading={connections.github.loading}
      error={connections.github.error}
      onConnect={actions.connectGitHub}
      onDisconnect={actions.disconnectGitHub}
      onClearError={() => actions.clearError('github')}
    />
  )
}