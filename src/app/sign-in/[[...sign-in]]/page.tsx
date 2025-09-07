'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    console.log('Sign-in page - isSignedIn:', isSignedIn, 'isLoaded:', isLoaded)
  }, [isSignedIn, isLoaded])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Already Signed In</h2>
          <p className="text-gray-600">You are already signed in. Redirecting to dashboard...</p>
          <a href="/dashboard" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back to Resumate
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to generate your AI-powered resume
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}