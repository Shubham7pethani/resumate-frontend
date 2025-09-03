export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: any): APIError {
  // Network errors
  if (!error.response) {
    return new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
  }

  const { status, data } = error.response

  // Extract error message from response
  let message = 'An unexpected error occurred'
  if (data?.error) {
    message = data.error
  } else if (data?.message) {
    message = data.message
  }

  // Handle specific status codes
  switch (status) {
    case 400:
      return new APIError(message || 'Invalid request', 400, 'BAD_REQUEST')
    case 401:
      return new APIError('Authentication required. Please sign in again.', 401, 'UNAUTHORIZED')
    case 403:
      return new APIError('You do not have permission to perform this action.', 403, 'FORBIDDEN')
    case 404:
      return new APIError('The requested resource was not found.', 404, 'NOT_FOUND')
    case 429:
      return new APIError('Too many requests. Please try again later.', 429, 'RATE_LIMITED')
    case 500:
      return new APIError('Server error. Please try again later.', 500, 'SERVER_ERROR')
    case 503:
      return new APIError('Service temporarily unavailable. Please try again later.', 503, 'SERVICE_UNAVAILABLE')
    default:
      return new APIError(message, status, 'UNKNOWN_ERROR')
  }
}

export function getErrorMessage(error: any): string {
  if (error instanceof APIError) {
    return error.message
  }

  if (error?.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

export function isRetryableError(error: APIError): boolean {
  const retryableCodes = [0, 408, 429, 500, 502, 503, 504]
  return retryableCodes.includes(error.statusCode)
}

export function shouldShowToast(error: APIError): boolean {
  // Don't show toast for authentication errors (handled by auth flow)
  if (error.statusCode === 401) {
    return false
  }

  // Don't show toast for validation errors (handled by forms)
  if (error.statusCode === 400 && error.code === 'VALIDATION_ERROR') {
    return false
  }

  return true
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      const apiError = handleAPIError(error)
      
      // Don't retry if it's not a retryable error
      if (!isRetryableError(apiError)) {
        throw apiError
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw apiError
      }

      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw handleAPIError(lastError)
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Prevent the default browser behavior
    event.preventDefault()
    
    // You can integrate with error reporting services here
    // Example: Sentry.captureException(event.reason)
  })
}