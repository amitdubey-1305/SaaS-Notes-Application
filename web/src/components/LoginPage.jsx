import React, { useState } from 'react';
import apiClient from '../api';  // Should be '../api' (lowercase)
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <-- New state for handling error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any previous errors
try {
  const response = await apiClient.post('/auth/login', {
    email: email,
    password: password,
  });

  const { token } = response.data;
  
  // --- THIS IS THE NEW PART ---
  // Save the token to the browser's local storage
  localStorage.setItem('token', token);
  
  // Reload the page. This will re-render our main App component,
  // which will then show the dashboard because a token now exists.
  window.location.reload();
  
} catch (err) {
      // If the backend returns an error (e.g., wrong password), we'll catch it
      console.error('Login failed:', err);
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {/* This line will display the error message if one exists */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;