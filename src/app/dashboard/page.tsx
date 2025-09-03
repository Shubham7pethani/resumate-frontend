'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import GitHubConnection from '@/components/GitHubConnection'
import LinkedInConnection from '@/components/LinkedInConnection'
import DataSummary from '@/components/DataSummary'
import ResumeGenerator from '@/components/ResumeGenerator'
import ResumeList from '@/components/ResumeList'

export default function Dashboard() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [connections, setConnections] = useState({
    github: false,
    linkedin: false
  })
  const [dataSummary, setDataSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    if (!user) return
    
    try {
      const token = await getToken()
      if (!token) return
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      // Fetch connection status
      try {
        const connectionsResponse = await fetch(`${backendUrl}/api/auth/connections`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (connectionsResponse.ok) {
          const connectionsData = await connectionsResponse.json()
          setConnections({
            github: connectionsData.githubConnected || false,
            linkedin: connectionsData.linkedinConnected || false
          })
        }
      } catch (err) {
        console.log('Connection status not available yet')
      }

      // Fetch data summary
      try {
        const summaryResponse = await fetch(`${backendUrl}/api/data/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json()
          setDataSummary(summaryData)
        }
      } catch (err) {
        console.log('Data summary not available yet')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, getToken])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleConnectionChange = (platform: 'github' | 'linkedin', connected: boolean) => {
    setConnections(prev => ({
      ...prev,
      [platform]: connected
    }))
    
    // Refresh data summary when connections change
    if (connected) {
      setTimeout(fetchDashboardData, 1000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Welcome back, {user?.firstName || 'there'}! Connect your accounts and generate your AI-powered resume.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${connections.github ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">GitHub</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${connections.linkedin ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Connections */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Connections</h2>
              
              <div className="space-y-4">
                <GitHubConnection onConnectionChange={(connected) => 
                  handleConnectionChange('github', connected)
                } />
                <LinkedInConnection onConnectionChange={(connected) => 
                  handleConnectionChange('linkedin', connected)
                } />
              </div>
            </div>

            {/* Data Summary Card */}
            <DataSummary 
              summary={dataSummary} 
              connections={connections}
              onRefresh={fetchDashboardData}
            />
          </div>

          {/* Right Column - Resume Generation & List */}
          <div className="lg:col-span-2 space-y-6">
            <ResumeGenerator 
              connections={connections}
              dataSummary={dataSummary}
              onDataRefresh={fetchDashboardData}
            />
            
            <ResumeList />
          </div>
        </div>
      </div>
    </div>
  )
}