'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'

interface ResumePreviewProps {
  resumeId: string
  onClose: () => void
  onDownload: () => void
}

export default function ResumePreview({ resumeId, onClose, onDownload }: ResumePreviewProps) {
  const { getToken } = useAuth()
  const [resume, setResume] = useState<{
    content?: {
      personalInfo?: {
        name?: string
        email?: string
        phone?: string
        location?: string
        linkedin?: string
        github?: string
      }
      summary?: string
      skills?: string[]
      experience?: Array<{
        title: string
        company: string
        startDate: string
        endDate?: string
        description?: string
      }>
      projects?: Array<{
        name: string
        description: string
        technologies?: string[]
      }>
      education?: Array<{
        degree: string
        field?: string
        school: string
        startDate: string
        endDate?: string
        description?: string
      }>
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState('professional')

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/${resumeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setResume(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch resume')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }, [resumeId, getToken])

  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  const handleDownload = async () => {
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/resume/${resumeId}/download?template=${selectedTemplate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${resume?.content?.personalInfo?.name || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        onDownload()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to download resume')
      }
    } catch (error) {
      setError('Download failed')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Resume</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Resume Preview</h2>
            <p className="text-sm text-gray-600">
              {resume?.content?.personalInfo?.name || 'Untitled Resume'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Template Selector */}
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
            </select>

            <button
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <ResumeContent resume={resume} template={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeContent({ resume, template }: { 
  resume: {
    content?: {
      personalInfo?: {
        name?: string
        email?: string
        phone?: string
        location?: string
        linkedin?: string
        github?: string
      }
      summary?: string
      skills?: string[]
      experience?: Array<{
        title: string
        company: string
        startDate: string
        endDate?: string
        description?: string
      }>
      projects?: Array<{
        name: string
        description: string
        technologies?: string[]
      }>
      education?: Array<{
        degree: string
        field?: string
        school: string
        startDate: string
        endDate?: string
        description?: string
      }>
    }
  } | null
  template: string 
}) {
  const content = resume?.content

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No resume content available</p>
      </div>
    )
  }

  const templateStyles = {
    professional: 'bg-white border border-gray-200',
    modern: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200',
    creative: 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200',
    technical: 'bg-gray-50 border border-gray-300'
  }

  const headerStyles = {
    professional: 'border-b-2 border-gray-800 text-gray-800',
    modern: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg',
    creative: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg',
    technical: 'bg-gray-800 text-white'
  }

  return (
    <div className={`${templateStyles[template as keyof typeof templateStyles]} rounded-lg shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className={`${headerStyles[template as keyof typeof headerStyles]} p-8 text-center`}>
        <h1 className="text-3xl font-bold mb-2">
          {content.personalInfo?.name || 'Your Name'}
        </h1>
        <div className="text-lg opacity-90">
          {content.personalInfo?.email && (
            <span className="mr-4">{content.personalInfo.email}</span>
          )}
          {content.personalInfo?.phone && (
            <span className="mr-4">{content.personalInfo.phone}</span>
          )}
          {content.personalInfo?.location && (
            <span>{content.personalInfo.location}</span>
          )}
        </div>
        {(content.personalInfo?.linkedin || content.personalInfo?.github) && (
          <div className="mt-2 text-sm opacity-80">
            {content.personalInfo.linkedin && (
              <span className="mr-4">{content.personalInfo.linkedin}</span>
            )}
            {content.personalInfo.github && (
              <span>{content.personalInfo.github}</span>
            )}
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {content.summary && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{content.summary}</p>
          </section>
        )}

        {/* Skills */}
        {content.skills && content.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {content.experience && content.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-3 border-indigo-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 italic">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {content.projects && content.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {content.projects.map((project: any, index: number) => (
                <div key={index} className="border-l-3 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {content.education && content.education.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {content.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-3 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                    </div>
                    <span className="text-sm text-gray-500 italic">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}