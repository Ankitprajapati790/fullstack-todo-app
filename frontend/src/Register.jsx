import React, { useState } from 'react'
import axios from 'axios'

function Register({ setView }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
      }, { withCredentials: true })

      if (res.status === 201) {
        setSuccess('✅ Registered successfully! You can now log in.')
        setError('')
        setView('login')
      }
    } catch (err) {
      console.error("Registration error:", err.response || err.message || err)
      setError(err.response?.data?.error || 'Registration failed')
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
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
      <button onClick={register} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p className="toggle-link" onClick={() => setView('login')}>
        Already have an account? Login here
      </p>
    </div>
  )
}

export default Register
