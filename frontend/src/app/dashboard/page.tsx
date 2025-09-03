
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// ... (keep existing imports and component structure)

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubStatus, setGithubStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const router = useRouter();

  useEffect(() => {
    // ... (keep existing useEffect logic)

    // Check for GitHub connection status
    if (router.query.github === 'connected') {
      setGithubStatus('connected');
    } else if (router.query.github === 'error') {
      setGithubStatus('error');
    }
  }, [router.query]);

  const handleGitHubConnect = async () => {
    try {
      const response = await fetch('/api/github/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate GitHub connection', error);
      setError('Failed to connect to GitHub. Please try again.');
    }
  };

  return (
    <div>
      {/* ... (existing dashboard content) */}
      
      {githubStatus === 'disconnected' && (
        <button onClick={handleGitHubConnect}>Connect GitHub Account</button>
      )}
      {githubStatus === 'connected' && (
        <p>GitHub account successfully connected!</p>
      )}
      {githubStatus === 'error' && (
        <p>Error connecting GitHub account. Please try again.</p>
      )}
      
      {/* ... (rest of the dashboard content) */}
    </div>
  );
};

export default Dashboard;
