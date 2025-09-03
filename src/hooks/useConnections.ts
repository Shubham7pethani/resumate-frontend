'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'

interface ConnectionStatus {
  github: {
    connected: boolean
    username?: string
    loading: boolean
    error?: string
  }
  linkedin: {
    connected: boolean
    linkedinId?: string
    loading: boolean
    error?: string
  }
}

export function useConnections() {
  const { getToken } = useAuth()
  const [connections, setConnections] = useState<ConnectionStatus>({
    github: { connected: false, loading: false },
    linkedin: { connected: false, loading: false }
  })
  const [loading, setLoading] = useState(true)

  const fetchConnectionStatus = useCallback(async () => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${backendUrl}/api/auth/connections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setConnections(prev => ({
          github: {
            ...prev.github,
            connected: data.githubConnected,
            username: data.githubUsername,
            error: undefined
          },
          linkedin: {
            ...prev.linkedin,
            connected: data.linkedinConnected,
            linkedinId: data.linkedinId,
            error: undefined
          }
        }))
      }
    } catch (error) {
      console.error('Error fetching connection status:', error)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectGitHub = useCallback(async () => {
    setConnections(prev => ({
      ...prev,
      github: { ...prev.github, loading: true, error: undefined }
    }))

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/github/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to GitHub OAuth
        window.location.href = data.authUrl
      } else {
        const errorData = await response.json()
        setConnections(prev => ({
          ...prev,
          github: {
            ...prev.github,
            loading: false,
            error: errorData.error || 'Failed to initiate GitHub connection'
          }
        }))
      }
    } catch (error) {
      setConnections(prev => ({
        ...prev,
        github: {
          ...prev.github,
          loading: false,
          error: 'Network error occurred'
        }
      }))
    }
  }, [getToken])

  const disconnectGitHub = useCallback(async () => {
    setConnections(prev => ({
      ...prev,
      github: { ...prev.github, loading: true, error: undefined }
    }))

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/github/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setConnections(prev => ({
          ...prev,
          github: {
            connected: false,
            username: undefined,
            loading: false,
            error: undefined
          }
        }))
      } else {
        const errorData = await response.json()
        setConnections(prev => ({
          ...prev,
          github: {
            ...prev.github,
            loading: false,
            error: errorData.error || 'Failed to disconnect GitHub'
          }
        }))
      }
    } catch (error) {
      setConnections(prev => ({
        ...prev,
        github: {
          ...prev.github,
          loading: false,
          error: 'Network error occurred'
        }
      }))
    }
  }, [getToken])

  const connectLinkedIn = useCallback(async () => {
    setConnections(prev => ({
      ...prev,
      linkedin: { ...prev.linkedin, loading: true, error: undefined }
    }))

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/linkedin/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to LinkedIn OAuth
        window.location.href = data.authUrl
      } else {
        const errorData = await response.json()
        setConnections(prev => ({
          ...prev,
          linkedin: {
            ...prev.linkedin,
            loading: false,
            error: errorData.error || 'Failed to initiate LinkedIn connection'
          }
        }))
      }
    } catch (error) {
      setConnections(prev => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          loading: false,
          error: 'Network error occurred'
        }
      }))
    }
  }, [getToken])

  const disconnectLinkedIn = useCallback(async () => {
    setConnections(prev => ({
      ...prev,
      linkedin: { ...prev.linkedin, loading: true, error: undefined }
    }))

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/linkedin/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setConnections(prev => ({
          ...prev,
          linkedin: {
            connected: false,
            linkedinId: undefined,
            loading: false,
            error: undefined
          }
        }))
      } else {
        const errorData = await response.json()
        setConnections(prev => ({
          ...prev,
          linkedin: {
            ...prev.linkedin,
            loading: false,
            error: errorData.error || 'Failed to disconnect LinkedIn'
          }
        }))
      }
    } catch (error) {
      setConnections(prev => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          loading: false,
          error: 'Network error occurred'
        }
      }))
    }
  }, [getToken])

  const clearError = useCallback((platform: 'github' | 'linkedin') => {
    setConnections(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        error: undefined
      }
    }))
  }, [])

  useEffect(() => {
    fetchConnectionStatus()
  }, [fetchConnectionStatus])

  // Check for OAuth callback success/error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const githubStatus = urlParams.get('github')
    const linkedinStatus = urlParams.get('linkedin')

    if (githubStatus === 'connected') {
      fetchConnectionStatus()
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (githubStatus === 'error') {
      setConnections(prev => ({
        ...prev,
        github: {
          ...prev.github,
          error: 'GitHub connection failed'
        }
      }))
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (linkedinStatus === 'connected') {
      fetchConnectionStatus()
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (linkedinStatus === 'error') {
      setConnections(prev => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          error: 'LinkedIn connection failed'
        }
      }))
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [fetchConnectionStatus])

  return {
    connections,
    loading,
    actions: {
      connectGitHub,
      disconnectGitHub,
      connectLinkedIn,
      disconnectLinkedIn,
      refresh: fetchConnectionStatus,
      clearError
    }
  }
}