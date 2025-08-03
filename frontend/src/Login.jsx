import React, { useState } from 'react'
import axios from 'axios'

function Login({ setToken, setView }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      )

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setError('')
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  const googleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/auth/google-login`
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      <button onClick={login}>Login</button>
      <button onClick={googleLogin}>Login with Google</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ Toggle to Register */}
      <p className="toggle-link" onClick={() => setView('register')}>
        Don't have an account? <span style={{ color: 'blue', cursor: 'pointer' }}>Register here</span>
      </p>
    </div>
  )
}

export default Login
