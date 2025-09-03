import { renderHook, act, waitFor } from '@testing-library/react'
import { useConnections } from '@/hooks/useConnections'

describe('useConnections', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useConnections())
    
    expect(result.current.connections.github.connected).toBe(false)
    expect(result.current.connections.linkedin.connected).toBe(false)
    expect(result.current.loading).toBe(true)
  })

  it('fetches connection status on mount', async () => {
    const mockResponse = {
      githubConnected: true,
      linkedinConnected: false,
      githubUsername: 'testuser'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.connections.github.connected).toBe(true)
      expect(result.current.connections.github.username).toBe('testuser')
      expect(result.current.connections.linkedin.connected).toBe(false)
    })
  })

  it('handles GitHub connection', async () => {
    const mockAuthUrl = 'https://github.com/login/oauth/authorize?...'
    
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ githubConnected: false, linkedinConnected: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authUrl: mockAuthUrl })
      })

    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.actions.connectGitHub()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/github/connect', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }))
    expect(window.location.href).toBe(mockAuthUrl)
  })

  it('handles GitHub disconnection', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ githubConnected: true, linkedinConnected: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Disconnected' })
      })

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.connections.github.connected).toBe(true)
    })

    await act(async () => {
      await result.current.actions.disconnectGitHub()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/github/disconnect', expect.objectContaining({
      method: 'POST'
    }))
    
    await waitFor(() => {
      expect(result.current.connections.github.connected).toBe(false)
    })
  })

  it('handles LinkedIn connection', async () => {
    const mockAuthUrl = 'https://www.linkedin.com/oauth/v2/authorization?...'
    
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ githubConnected: false, linkedinConnected: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authUrl: mockAuthUrl })
      })

    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.actions.connectLinkedIn()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/linkedin/connect', expect.objectContaining({
      method: 'POST'
    }))
    expect(window.location.href).toBe(mockAuthUrl)
  })

  it('handles connection errors', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ githubConnected: false, linkedinConnected: false })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Connection failed' })
      })

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.actions.connectGitHub()
    })

    await waitFor(() => {
      expect(result.current.connections.github.error).toBe('Connection failed')
    })
  })

  it('clears errors', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ githubConnected: false, linkedinConnected: false })
    })

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Manually set an error
    act(() => {
      result.current.connections.github.error = 'Test error'
    })

    act(() => {
      result.current.actions.clearError('github')
    })

    expect(result.current.connections.github.error).toBeUndefined()
  })

  it('refreshes connection status', async () => {
    const mockResponse = {
      githubConnected: true,
      linkedinConnected: true
    }

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ githubConnected: false, linkedinConnected: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

    const { result } = renderHook(() => useConnections())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.connections.github.connected).toBe(false)
    })

    await act(async () => {
      await result.current.actions.refresh()
    })

    await waitFor(() => {
      expect(result.current.connections.github.connected).toBe(true)
      expect(result.current.connections.linkedin.connected).toBe(true)
    })
  })
})