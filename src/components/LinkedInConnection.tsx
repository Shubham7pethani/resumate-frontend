import React from 'react'
import ConnectionCard from './ConnectionCard'
import { useConnections } from '@/hooks/useConnections'

interface LinkedInConnectionProps {
  onConnectionChange?: (connected: boolean) => void
}

export default function LinkedInConnection({ onConnectionChange }: LinkedInConnectionProps) {
  const { connections, actions } = useConnections()
  
  // Notify parent of connection changes
  React.useEffect(() => {
    onConnectionChange?.(connections.linkedin.connected)
  }, [connections.linkedin.connected, onConnectionChange])

  return (
    <ConnectionCard
      platform="linkedin"
      connected={connections.linkedin.connected}
      username={connections.linkedin.linkedinId}
      loading={connections.linkedin.loading}
      error={connections.linkedin.error}
      onConnect={actions.connectLinkedIn}
      onDisconnect={actions.disconnectLinkedIn}
      onClearError={() => actions.clearError('linkedin')}
    />
  )
}