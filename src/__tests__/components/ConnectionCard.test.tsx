import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConnectionCard from '@/components/ConnectionCard'

describe('ConnectionCard', () => {
  const defaultProps = {
    platform: 'github' as const,
    connected: false,
    loading: false,
    onConnect: jest.fn(),
    onDisconnect: jest.fn(),
    onClearError: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders GitHub connection card correctly', () => {
    render(<ConnectionCard {...defaultProps} />)
    
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Not connected')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders LinkedIn connection card correctly', () => {
    render(
      <ConnectionCard 
        {...defaultProps} 
        platform="linkedin" 
      />
    )
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Not connected')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('shows connected state correctly', () => {
    render(
      <ConnectionCard 
        {...defaultProps} 
        connected={true}
        username="testuser"
      />
    )
    
    expect(screen.getByText('Connected as testuser')).toBeInTheDocument()
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
    expect(screen.getByText('✓ Connected')).toBeInTheDocument()
    expect(screen.getByText('Data sync enabled')).toBeInTheDocument()
  })

  it('shows loading state correctly', () => {
    render(
      <ConnectionCard 
        {...defaultProps} 
        loading={true}
      />
    )
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows error message', () => {
    const errorMessage = 'Connection failed'
    render(
      <ConnectionCard 
        {...defaultProps} 
        error={errorMessage}
      />
    )
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('calls onConnect when connect button is clicked', () => {
    const onConnect = jest.fn()
    render(
      <ConnectionCard 
        {...defaultProps} 
        onConnect={onConnect}
      />
    )
    
    fireEvent.click(screen.getByText('Connect'))
    expect(onConnect).toHaveBeenCalledTimes(1)
  })

  it('calls onDisconnect when disconnect button is clicked', () => {
    const onDisconnect = jest.fn()
    render(
      <ConnectionCard 
        {...defaultProps} 
        connected={true}
        onDisconnect={onDisconnect}
      />
    )
    
    fireEvent.click(screen.getByText('Disconnect'))
    expect(onDisconnect).toHaveBeenCalledTimes(1)
  })

  it('calls onClearError when error close button is clicked', () => {
    const onClearError = jest.fn()
    render(
      <ConnectionCard 
        {...defaultProps} 
        error="Test error"
        onClearError={onClearError}
      />
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(onClearError).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling for connected state', () => {
    const { container } = render(
      <ConnectionCard 
        {...defaultProps} 
        connected={true}
      />
    )
    
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('border-gray-900', 'bg-green-50')
  })

  it('applies correct styling for disconnected state', () => {
    const { container } = render(
      <ConnectionCard 
        {...defaultProps} 
        connected={false}
      />
    )
    
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('border-gray-200', 'bg-white')
  })
})