'use client'

import { useAuth, useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        try {
          const t = await getToken()
          setToken(t)
        } catch (error) {
          console.error('Error getting token:', error)
        }
      }
    }
    fetchToken()
  }, [isSignedIn, getToken])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clerk Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
            <div className="space-y-2">
              <p><strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Is Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</p>
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
              <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'None'}</p>
              <p><strong>First Name:</strong> {user?.firstName || 'None'}</p>
              <p><strong>Last Name:</strong> {user?.lastName || 'None'}</p>
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Token Info</h2>
            <div className="space-y-2">
              <p><strong>Has Token:</strong> {token ? '✅ Yes' : '❌ No'}</p>
              {token && (
                <div>
                  <p><strong>Token (first 50 chars):</strong></p>
                  <code className="text-xs bg-gray-100 p-2 rounded block mt-1">
                    {token.substring(0, 50)}...
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-4">
              {isSignedIn && (
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Sign Out
                </button>
              )}
              
              <button
                onClick={clearLocalStorage}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Clear Local Storage & Reload
              </button>
              
              <a
                href="/sign-in"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
              >
                Go to Sign In
              </a>
              
              <a
                href="/sign-up"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
              >
                Go to Sign Up
              </a>
              
              <a
                href="/dashboard"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
              >
                Go to Dashboard
              </a>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>NEXT_PUBLIC_CLERK_SIGN_IN_URL:</strong> {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || 'Not set'}</p>
              <p><strong>NEXT_PUBLIC_CLERK_SIGN_UP_URL:</strong> {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || 'Not set'}</p>
              <p><strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:</strong> {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || 'Not set'}</p>
              <p><strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:</strong> {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || 'Not set'}</p>
            </div>
          </div>

          {/* Browser Storage */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Browser Storage</h2>
            <div className="space-y-2 text-sm">
              <p><strong>LocalStorage items:</strong> {typeof window !== 'undefined' ? Object.keys(localStorage).length : 'N/A'}</p>
              <p><strong>SessionStorage items:</strong> {typeof window !== 'undefined' ? Object.keys(sessionStorage).length : 'N/A'}</p>
              {typeof window !== 'undefined' && Object.keys(localStorage).length > 0 && (
                <div>
                  <p><strong>LocalStorage keys:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {Object.keys(localStorage).map(key => (
                      <li key={key} className="text-xs">{key}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}