"use client"

import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'

interface LinkedInCsvUploaderProps {
  onUploaded?: () => void
}

export default function LinkedInCsvUploader({ onUploaded }: LinkedInCsvUploaderProps) {
  const { getToken } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(undefined)
    setSuccess(undefined)
    setUploading(true)

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`${backendUrl}/api/linkedin/upload-data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`
          // NOTE: Let the browser set Content-Type with boundary for multipart
        },
        body: form
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('LinkedIn data uploaded successfully')
      onUploaded?.()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      // reset input value so same file can be re-selected
      e.currentTarget.value = ''
    }
  }

  return (
    <div className="mt-4 border rounded-md p-4 bg-blue-50 border-blue-200">
      <h3 className="text-sm font-semibold text-blue-900">Import your LinkedIn data</h3>
      <p className="text-sm text-blue-800 mt-2">
        Since we are not a LinkedIn partner, please export your data from LinkedIn and upload it here. Well parse your profile, experience, education, and skills to power your resume.
      </p>

      <div className="mt-3">
        <ol className="list-decimal ml-5 text-sm text-blue-900 space-y-1">
          <li>Open LinkedIn → Me → Settings & Privacy</li>
          <li>Data privacy → Get a copy of your data</li>
          <li>Select Download your data</li>
          <li>Choose: Profile Information, Positions, Education, Skills, Recommendations, Certifications</li>
          <li>Request archive, then download the ZIP when its ready</li>
          <li>Upload the ZIP (preferred) or individual CSV files here</li>
        </ol>
      </div>

      <div className="mt-4">
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer">
          <input
            type="file"
            accept=".zip,.csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? 'Uploading…' : 'Upload ZIP/CSV'}
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-700">{success}</p>}

      <p className="mt-3 text-xs text-blue-900/80">
        Supported: a single ZIP from LinkedIn, or separate CSVs for positions, profile, education, skills, etc.
      </p>
    </div>
  )
}