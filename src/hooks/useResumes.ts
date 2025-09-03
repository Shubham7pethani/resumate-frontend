'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'

interface Resume {
  id: string
  name: string
  status: 'generating' | 'completed' | 'failed'
  createdAt: string
  generatedBy: 'ai' | 'manual'
}

export function useResumes() {
  const { getToken } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes)
        setError('')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch resumes')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const downloadResume = useCallback(async (
    resumeId: string, 
    template: string = 'professional',
    format: string = 'A4'
  ) => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(
        `${backendUrl}/api/resume/${resumeId}/download?template=${template}&format=${format}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition')
        let filename = 'resume.pdf'
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        // Create download link
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        
        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        return { success: true }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to download resume')
      }
    } catch (error: any) {
      console.error('Download error:', error)
      return { success: false, error: error.message }
    }
  }, [getToken])

  const deleteResume = useCallback(async (resumeId: string) => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/${resumeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        // Remove from local state
        setResumes(prev => prev.filter(resume => resume.id !== resumeId))
        return { success: true }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete resume')
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }
  }, [getToken])

  const regenerateResume = useCallback(async (
    resumeId: string,
    options: { style?: string; focusArea?: string } = {}
  ) => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/${resumeId}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      })

      if (response.ok) {
        const data = await response.json()
        // Update local state
        setResumes(prev => prev.map(resume => 
          resume.id === resumeId 
            ? { ...resume, status: 'completed' }
            : resume
        ))
        return { success: true, resume: data.resume }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to regenerate resume')
      }
    } catch (error: any) {
      console.error('Regenerate error:', error)
      return { success: false, error: error.message }
    }
  }, [getToken])

  const checkEligibility = useCallback(async () => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/check/eligibility`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to check eligibility')
      }
    } catch (error: any) {
      console.error('Eligibility check error:', error)
      return {
        canGenerate: false,
        reason: error.message,
        requirements: {
          hasGitHub: false,
          hasLinkedIn: false,
          hasProfileData: false
        }
      }
    }
  }, [getToken])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  return {
    resumes,
    loading,
    error,
    actions: {
      fetchResumes,
      downloadResume,
      deleteResume,
      regenerateResume,
      checkEligibility
    }
  }
}