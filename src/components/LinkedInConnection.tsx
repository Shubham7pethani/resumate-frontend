import React from 'react'
import ConnectionCard from './ConnectionCard'
import { useConnections } from '@/hooks/useConnections'
import LinkedInCsvUploader from './LinkedInCsvUploader'

interface LinkedInConnectionProps {
  onConnectionChange?: (connected: boolean) => void
}

export default function LinkedInConnection({ onConnectionChange }: LinkedInConnectionProps) {
  const { connections, actions } = useConnections()
  
  // Notify parent of connection changes (avoid infinite loops by not depending on callback identity)
  React.useEffect(() => {
    onConnectionChange?.(connections.linkedin.connected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections.linkedin.connected])

  return (
    <div className="space-y-2">
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

      {connections.linkedin.connected && (
        <LinkedInCsvUploader onUploaded={actions.refresh} />
      )}
    </div>
  )
}