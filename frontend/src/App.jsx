import React, { useEffect, useState } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Todos from './Todos.jsx'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [view, setView] = useState('login') // login | register

  useEffect(() => {
    const url = new URL(window.location.href)
    const t = url.searchParams.get('token')

    if (t) {
      try {
        localStorage.setItem('token', t)
        setToken(t)
        window.history.replaceState({}, document.title, '/')
      } catch (e) {
        console.error("Failed to save token:", e)
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setView('login')
  }

  return (
    <div className="app-container">
      {token ? (
        <Todos token={token} logout={logout} />
      ) : (
        view === 'login' ? (
          <Login setToken={setToken} setView={setView} />
        ) : (
          <Register setView={setView} />
        )
      )}
    </div>
  )
}

export default App
