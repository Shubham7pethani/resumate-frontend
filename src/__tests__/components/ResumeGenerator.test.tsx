import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResumeGenerator from '@/components/ResumeGenerator'

// Mock the ResumePreview component
jest.mock('@/components/ResumePreview', () => {
  return function MockResumePreview({ onClose, onDownload }: any) {
    return (
      <div data-testid="resume-preview">
        <button onClick={onClose}>Close Preview</button>
        <button onClick={onDownload}>Download</button>
      </div>
    )
  }
})

describe('ResumeGenerator', () => {
  const defaultProps = {
    connections: {
      github: false,
      linkedin: false,
    },
    dataSummary: null,
    onDataRefresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('shows connect accounts message when no connections', () => {
    render(<ResumeGenerator {...defaultProps} />)
    
    expect(screen.getByText('Connect Your Accounts')).toBeInTheDocument()
    expect(screen.getByText(/Connect your GitHub and\/or LinkedIn accounts/)).toBeInTheDocument()
  })

  it('shows process data message when connected but no data', () => {
    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
      />
    )
    
    expect(screen.getByText('Process Your Data')).toBeInTheDocument()
    expect(screen.getByText('Process Data')).toBeInTheDocument()
  })

  it('shows resume generation form when data is available', () => {
    const dataSummary = {
      github: {
        repositories: 5,
        languages: 3,
        followers: 10,
        publicRepos: 8
      }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        dataSummary={dataSummary}
      />
    )
    
    expect(screen.getByText('Ready to Generate Resume')).toBeInTheDocument()
    expect(screen.getByText('Generate Resume')).toBeInTheDocument()
    expect(screen.getByLabelText('Resume Style')).toBeInTheDocument()
    expect(screen.getByLabelText('Focus Area')).toBeInTheDocument()
  })

  it('processes data when process button is clicked', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    const onDataRefresh = jest.fn()
    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        onDataRefresh={onDataRefresh}
      />
    )
    
    fireEvent.click(screen.getByText('Process Data'))
    
    expect(screen.getByText('Processing Data...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/data/github/process', expect.any(Object))
      expect(onDataRefresh).toHaveBeenCalled()
    })
  })

  it('generates resume when generate button is clicked', async () => {
    const mockResumeResponse = {
      resume: {
        id: 'resume-123',
        content: { personalInfo: { name: 'John Doe' } }
      }
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResumeResponse
    })

    const dataSummary = {
      github: { repositories: 5, languages: 3 }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        dataSummary={dataSummary}
      />
    )
    
    fireEvent.click(screen.getByText('Generate Resume'))
    
    expect(screen.getByText('Generating Resume...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/resume/generate', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('professional')
      }))
    })
  })

  it('shows preview modal after successful generation', async () => {
    const mockResumeResponse = {
      resume: {
        id: 'resume-123',
        content: { personalInfo: { name: 'John Doe' } }
      }
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResumeResponse
    })

    const dataSummary = {
      github: { repositories: 5, languages: 3 }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        dataSummary={dataSummary}
      />
    )
    
    fireEvent.click(screen.getByText('Generate Resume'))
    
    await waitFor(() => {
      expect(screen.getByTestId('resume-preview')).toBeInTheDocument()
    })
  })

  it('handles generation errors correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Generation failed' })
    })

    const dataSummary = {
      github: { repositories: 5, languages: 3 }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        dataSummary={dataSummary}
      />
    )
    
    fireEvent.click(screen.getByText('Generate Resume'))
    
    await waitFor(() => {
      expect(screen.getByText('Generation failed')).toBeInTheDocument()
    })
  })

  it('updates resume style and focus area', () => {
    const dataSummary = {
      github: { repositories: 5, languages: 3 }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: false }}
        dataSummary={dataSummary}
      />
    )
    
    const styleSelect = screen.getByLabelText('Resume Style')
    const focusSelect = screen.getByLabelText('Focus Area')
    
    fireEvent.change(styleSelect, { target: { value: 'modern' } })
    fireEvent.change(focusSelect, { target: { value: 'frontend development' } })
    
    expect(styleSelect).toHaveValue('modern')
    expect(focusSelect).toHaveValue('frontend development')
  })

  it('shows data summary correctly', () => {
    const dataSummary = {
      github: {
        repositories: 10,
        languages: 5,
        followers: 20,
        publicRepos: 15
      },
      linkedin: {
        experience: 3,
        skills: 8
      }
    }

    render(
      <ResumeGenerator 
        {...defaultProps} 
        connections={{ github: true, linkedin: true }}
        dataSummary={dataSummary}
      />
    )
    
    expect(screen.getByText('10 repositories, 5 languages')).toBeInTheDocument()
    expect(screen.getByText('3 experiences, 8 skills')).toBeInTheDocument()
  })
})