'use client'

import { useState } from 'react'
import { useResumes } from '@/hooks/useResumes'
import ResumePreview from './ResumePreview'

export default function ResumeList() {
  const { resumes, loading, error, actions } = useResumes()
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string>('')
  const [deletingId, setDeletingId] = useState<string>('')

  const handleDownload = async (resumeId: string, template: string = 'professional') => {
    setDownloadingId(resumeId)
    try {
      const result = await actions.downloadResume(resumeId, template)
      if (!result.success) {
        alert(`Download failed: ${result.error}`)
      }
    } finally {
      setDownloadingId('')
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return
    }

    setDeletingId(resumeId)
    try {
      const result = await actions.deleteResume(resumeId)
      if (!result.success) {
        alert(`Delete failed: ${result.error}`)
      }
    } finally {
      setDeletingId('')
    }
  }

  const handlePreview = (resumeId: string) => {
    setSelectedResumeId(resumeId)
    setShowPreview(true)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resumes</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resumes</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={actions.fetchResumes}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resumes</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No resumes yet</p>
          <p className="text-sm text-gray-400">Generate your first AI-powered resume to get started</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Resumes</h3>
          <button
            onClick={actions.fetchResumes}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{resume.name}</h4>
                    <StatusBadge status={resume.status} />
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>Created {new Date(resume.createdAt).toLocaleDateString()}</span>
                    <span className="capitalize">{resume.generatedBy}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {resume.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handlePreview(resume.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Preview
                      </button>
                      
                      <button
                        onClick={() => handleDownload(resume.id)}
                        disabled={downloadingId === resume.id}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1"
                      >
                        {downloadingId === resume.id ? (
                          <>
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingId === resume.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedResumeId && (
        <ResumePreview
          resumeId={selectedResumeId}
          onClose={() => setShowPreview(false)}
          onDownload={() => setShowPreview(false)}
        />
      )}
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    generating: {
      color: 'bg-yellow-100 text-yellow-800',
      text: 'Generating'
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      text: 'Ready'
    },
    failed: {
      color: 'bg-red-100 text-red-800',
      text: 'Failed'
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.failed

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  )
}