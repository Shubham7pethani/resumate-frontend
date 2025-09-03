'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import ResumePreview from './ResumePreview'

interface ResumeGeneratorProps {
  connections: {
    github: boolean
    linkedin: boolean
  }
  dataSummary: {
    github?: {
      repositories: number
      languages: number
    }
    linkedin?: {
      experience: number
      skills: number
    }
  } | null
  onDataRefresh: () => void
}

export default function ResumeGenerator({ connections, dataSummary, onDataRefresh }: ResumeGeneratorProps) {
  const { getToken } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [processingData, setProcessingData] = useState(false)
  const [error, setError] = useState<string>('')

  const canGenerate = connections.github || connections.linkedin
  const hasData = dataSummary?.github || dataSummary?.linkedin

  const handleProcessData = async () => {
    setProcessingData(true)
    setError('')

    try {
      const token = await getToken()
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      // Process GitHub data if connected
      if (connections.github) {
        const githubResponse = await fetch(`${backendUrl}/api/data/github/process`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!githubResponse.ok) {
          const errorData = await githubResponse.json()
          throw new Error(`GitHub: ${errorData.error}`)
        }
      }

      // Process LinkedIn data if connected
      if (connections.linkedin) {
        const linkedinResponse = await fetch(`${backendUrl}/api/data/linkedin/process`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!linkedinResponse.ok) {
          const errorData = await linkedinResponse.json()
          throw new Error(`LinkedIn: ${errorData.error}`)
        }
      }

      // Refresh dashboard data
      onDataRefresh()
    } catch (error: any) {
      setError(error.message || 'Failed to process data')
    } finally {
      setProcessingData(false)
    }
  }

  const [showPreview, setShowPreview] = useState(false)
  const [generatedResumeId, setGeneratedResumeId] = useState<string>('')
  const [resumeStyle, setResumeStyle] = useState('professional')
  const [focusArea, setFocusArea] = useState('full-stack development')

  const handleGenerateResume = async () => {
    setGenerating(true)
    setError('')

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          style: resumeStyle,
          focusArea: focusArea
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedResumeId(data.resume.id)
        setShowPreview(true)
        onDataRefresh() // Refresh dashboard data
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to generate resume')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Resume Generation</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {!canGenerate ? (
        // No connections
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
          <p className="text-gray-500 mb-6">
            Connect your GitHub and/or LinkedIn accounts to start generating your AI-powered resume.
          </p>
        </div>
      ) : !hasData ? (
        // Has connections but no data processed
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Process Your Data</h3>
          <p className="text-gray-500 mb-6">
            Your accounts are connected! Now let's fetch and process your profile data.
          </p>
          <button
            onClick={handleProcessData}
            disabled={processingData}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium"
          >
            {processingData ? 'Processing Data...' : 'Process Data'}
          </button>
        </div>
      ) : (
        // Ready to generate resume
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to Generate Resume</h3>
            
            {/* Data Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Available Data:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSummary?.github && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      {dataSummary.github.repositories} repositories, {dataSummary.github.languages} languages
                    </span>
                  </div>
                )}
                
                {dataSummary?.linkedin && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      {dataSummary.linkedin.experience} experiences, {dataSummary.linkedin.skills} skills
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Generation Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Style
                </label>
                <select 
                  value={resumeStyle}
                  onChange={(e) => setResumeStyle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <select 
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="full-stack development">Full Stack Development</option>
                  <option value="frontend development">Frontend Development</option>
                  <option value="backend development">Backend Development</option>
                  <option value="devops engineering">DevOps Engineering</option>
                  <option value="data science">Data Science</option>
                  <option value="mobile development">Mobile Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleGenerateResume}
              disabled={generating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center"
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Resume...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Resume
                </>
              )}
            </button>
            
            <button
              onClick={handleProcessData}
              disabled={processingData}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-medium"
            >
              {processingData ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {showPreview && generatedResumeId && (
        <ResumePreview
          resumeId={generatedResumeId}
          onClose={() => setShowPreview(false)}
          onDownload={() => {
            // Handle successful download
            setShowPreview(false)
          }}
        />
      )}
    </div>
  )
}