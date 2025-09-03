'use client'

interface ConnectionCardProps {
  platform: 'github' | 'linkedin'
  connected: boolean
  username?: string
  loading: boolean
  error?: string
  onConnect: () => void
  onDisconnect: () => void
  onClearError: () => void
}

export default function ConnectionCard({
  platform,
  connected,
  username,
  loading,
  error,
  onConnect,
  onDisconnect,
  onClearError
}: ConnectionCardProps) {
  const platformConfig = {
    github: {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-gray-900',
      borderColor: 'border-gray-900'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-blue-600',
      borderColor: 'border-blue-600'
    }
  }

  const config = platformConfig[platform]

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${
      connected ? `${config.borderColor} bg-green-50` : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <p className="font-medium text-gray-900">{config.name}</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-400' : 'bg-gray-300'
              }`}></div>
              <p className="text-sm text-gray-500">
                {connected ? (
                  username ? `Connected as ${username}` : 'Connected'
                ) : 'Not connected'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {error && (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={onClearError}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {connected ? (
            <button
              onClick={onDisconnect}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {/* Connection Status Indicator */}
      {connected && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700 font-medium">✓ Connected</span>
            <span className="text-gray-500">Data sync enabled</span>
          </div>
        </div>
      )}
    </div>
  )
}