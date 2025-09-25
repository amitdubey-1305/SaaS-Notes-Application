import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  // We use state to keep track of the token
  const [token, setToken] = useState(null);

  // useEffect runs when the component first loads
  useEffect(() => {
    // Check local storage for a token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // The empty array means this effect runs only once on mount

  // This is the core logic of our app's navigation
  return (
    <div className="container">
      <h1>SaaS Notes App</h1>
      {/* If a token exists, show the Dashboard. Otherwise, show the LoginPage. */}
      {token ? <Dashboard /> : <LoginPage />}
    </div>
  );
}

export default App;