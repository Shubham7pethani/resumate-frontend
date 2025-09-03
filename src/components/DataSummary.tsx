'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'

interface DataSummaryProps {
  summary: {
    github?: {
      repositories: number
      languages: number
      followers: number
      publicRepos: number
    }
    linkedin?: {
      experience: number
      education: number
      skills: number
    }
    lastUpdated?: string
  } | null
  connections: {
    github: boolean
    linkedin: boolean
  }
  onRefresh: () => void
}

export default function DataSummary({ summary, connections, onRefresh }: DataSummaryProps) {
  const { getToken } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefreshData = async () => {
    setRefreshing(true)
    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/data/fetch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!summary && (!connections.github && !connections.linkedin)) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Connect your accounts to see data summary</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Summary</h3>
        <button
          onClick={handleRefreshData}
          disabled={refreshing}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-4">
        {/* GitHub Data */}
        {connections.github && summary?.github && (
          <div className="border-l-4 border-gray-900 pl-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              GitHub
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Repositories:</span>
                <span className="ml-1 font-medium">{summary.github.repositories}</span>
              </div>
              <div>
                <span className="text-gray-500">Languages:</span>
                <span className="ml-1 font-medium">{summary.github.languages}</span>
              </div>
              <div>
                <span className="text-gray-500">Followers:</span>
                <span className="ml-1 font-medium">{summary.github.followers}</span>
              </div>
              <div>
                <span className="text-gray-500">Public Repos:</span>
                <span className="ml-1 font-medium">{summary.github.publicRepos}</span>
              </div>
            </div>
          </div>
        )}

        {/* LinkedIn Data */}
        {connections.linkedin && summary?.linkedin && (
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
              LinkedIn
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Experience:</span>
                <span className="ml-1 font-medium">{summary.linkedin.experience}</span>
              </div>
              <div>
                <span className="text-gray-500">Education:</span>
                <span className="ml-1 font-medium">{summary.linkedin.education}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Skills:</span>
                <span className="ml-1 font-medium">{summary.linkedin.skills}</span>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {summary?.lastUpdated && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(summary.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}