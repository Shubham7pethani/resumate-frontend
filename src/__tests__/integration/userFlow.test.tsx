import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '@/app/dashboard/page'

// Mock all the components and hooks
jest.mock('@/hooks/useConnections', () => ({
  useConnections: () => ({
    connections: {
      github: { connected: false, loading: false },
      linkedin: { connected: false, loading: false }
    },
    loading: false,
    actions: {
      connectGitHub: jest.fn(),
      disconnectGitHub: jest.fn(),
      connectLinkedIn: jest.fn(),
      disconnectLinkedIn: jest.fn(),
      refresh: jest.fn(),
      clearError: jest.fn()
    }
  })
}))

jest.mock('@/hooks/useResumes', () => ({
  useResumes: () => ({
    resumes: [],
    loading: false,
    error: '',
    actions: {
      fetchResumes: jest.fn(),
      downloadResume: jest.fn(),
      deleteResume: jest.fn(),
      regenerateResume: jest.fn(),
      checkEligibility: jest.fn()
    }
  })
}))

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should render dashboard with connection options', async () => {
    // Mock successful API responses
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: false,
          linkedinConnected: false
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: null,
          linkedin: null,
          lastUpdated: null
        })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Account Connections')).toBeInTheDocument()
      expect(screen.getByText('GitHub')).toBeInTheDocument()
      expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    })
  })

  it('should show connect accounts message when no connections', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: false,
          linkedinConnected: false
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: null,
          linkedin: null,
          lastUpdated: null
        })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Connect Your Accounts')).toBeInTheDocument()
      expect(screen.getByText(/Connect your GitHub and\/or LinkedIn accounts/)).toBeInTheDocument()
    })
  })

  it('should show process data option when connected but no data', async () => {
    // Mock connected state but no data
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: true,
          linkedinConnected: false,
          githubUsername: 'testuser'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: null,
          linkedin: null,
          lastUpdated: null
        })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Process Your Data')).toBeInTheDocument()
      expect(screen.getByText('Process Data')).toBeInTheDocument()
    })
  })

  it('should show resume generation when data is available', async () => {
    // Mock connected state with data
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: true,
          linkedinConnected: true,
          githubUsername: 'testuser'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: {
            username: 'testuser',
            repositories: 10,
            languages: 5,
            followers: 20,
            publicRepos: 15
          },
          linkedin: {
            headline: 'Software Developer',
            experience: 3,
            education: 2,
            skills: 12
          },
          lastUpdated: new Date().toISOString()
        })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Ready to Generate Resume')).toBeInTheDocument()
      expect(screen.getByText('Generate Resume')).toBeInTheDocument()
      expect(screen.getByLabelText('Resume Style')).toBeInTheDocument()
      expect(screen.getByLabelText('Focus Area')).toBeInTheDocument()
    })
  })

  it('should handle resume generation flow', async () => {
    const user = userEvent.setup()

    // Mock all necessary API responses
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: true,
          linkedinConnected: false,
          githubUsername: 'testuser'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: {
            username: 'testuser',
            repositories: 5,
            languages: 3,
            followers: 10,
            publicRepos: 8
          },
          lastUpdated: new Date().toISOString()
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          resumes: [],
          total: 0
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Resume generated successfully',
          resume: {
            id: 'resume-123',
            content: {
              personalInfo: { name: 'John Doe', email: 'john@example.com' },
              summary: 'Experienced developer',
              skills: ['JavaScript', 'React'],
              experience: [],
              projects: [],
              education: []
            },
            status: 'completed'
          }
        })
      })

    render(<Dashboard />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Generate Resume')).toBeInTheDocument()
    })

    // Select resume style
    const styleSelect = screen.getByLabelText('Resume Style')
    await user.selectOptions(styleSelect, 'modern')

    // Select focus area
    const focusSelect = screen.getByLabelText('Focus Area')
    await user.selectOptions(focusSelect, 'frontend development')

    // Click generate button
    const generateButton = screen.getByText('Generate Resume')
    await user.click(generateButton)

    // Should show generating state
    await waitFor(() => {
      expect(screen.getByText('Generating Resume...')).toBeInTheDocument()
    })

    // Should eventually show success and preview
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/resume/generate', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('modern')
      }))
    })
  })

  it('should handle connection errors gracefully', async () => {
    // Mock API error
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Connection failed' })
      })

    render(<Dashboard />)

    await waitFor(() => {
      // Should still render the dashboard structure
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should handle data processing errors', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: true,
          linkedinConnected: false,
          githubUsername: 'testuser'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: null,
          linkedin: null,
          lastUpdated: null
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          resumes: [],
          total: 0
        })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Data processing failed' })
      })

    const user = userEvent.setup()

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Process Data')).toBeInTheDocument()
    })

    const processButton = screen.getByText('Process Data')
    await user.click(processButton)

    await waitFor(() => {
      expect(screen.getByText('Data processing failed')).toBeInTheDocument()
    })
  })

  it('should handle resume generation errors', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: true,
          linkedinConnected: false,
          githubUsername: 'testuser'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: {
            username: 'testuser',
            repositories: 5,
            languages: 3
          },
          lastUpdated: new Date().toISOString()
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          resumes: [],
          total: 0
        })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'AI service temporarily unavailable' })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Generate Resume')).toBeInTheDocument()
    })

    const generateButton = screen.getByText('Generate Resume')
    await user.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('AI service temporarily unavailable')).toBeInTheDocument()
    })
  })

  it('should show loading states appropriately', async () => {
    // Mock slow API response
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            githubConnected: false,
            linkedinConnected: false
          })
        }), 100)
      )
    )

    render(<Dashboard />)

    // Should show loading spinner initially
    expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument()

    // Should eventually load content
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should handle responsive design', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          githubConnected: false,
          linkedinConnected: false
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          github: null,
          linkedin: null,
          lastUpdated: null
        })
      })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Should still render all essential elements on mobile
    expect(screen.getByText('Account Connections')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })
})