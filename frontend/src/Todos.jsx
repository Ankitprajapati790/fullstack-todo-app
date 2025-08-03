import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Todos({ token, logout }) {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      setTodos(res.data)
    } catch (err) {
      console.error(err)
      setError('❌ Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    const trimmed = newTodo.trim()
    if (!trimmed) {
      setError("❗ Todo content can't be empty")
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { content: trimmed }, {
        headers: { Authorization: 'Bearer ' + token }
      })
      setNewTodo('')
      fetchTodos()
    } catch (err) {
      console.error(err)
      setError('❌ Failed to add todo')
    }
  }

  const updateTodo = async (id, currentContent) => {
    const updated = prompt('✏️ Update Todo', currentContent)
    if (updated === null) return // cancelled
    const trimmed = updated.trim()
    if (!trimmed) {
      setError("❗ Updated todo can't be empty")
      return
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, { content: trimmed }, {
        headers: { Authorization: 'Bearer ' + token }
      })
      fetchTodos()
    } catch (err) {
      console.error(err)
      setError('❌ Failed to update todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      fetchTodos()
    } catch (err) {
      console.error(err)
      setError('❌ Failed to delete todo')
    }
  }

  useEffect(() => {
    if (token) fetchTodos()
  }, [token])

  return (
    <div style={{
      maxWidth: '400px',
      margin: 'auto',
      padding: '2rem',
      borderRadius: '20px',
      background: '#fff',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h2>📋 <span style={{ color: '#d35400' }}>Todo List</span></h2>

      <button onClick={logout}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', marginBottom: '1rem' }}>
        🔓 Logout
      </button>

      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}

      <form
        onSubmit={e => {
          e.preventDefault()
          addTodo()
        }}
        style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Enter a new todo..."
          style={{
            flexGrow: 1,
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            minWidth: '0' // ensures placeholder shows
          }}
        />
        <button type="submit"
          style={{
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px'
          }}>
          ➕ Add
        </button>
      </form>

      {loading ? <p>⏳ Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li key={todo.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f4f4f4',
              padding: '8px 12px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}>
              <span>{todo.content}</span>
              <div>
                <button onClick={() => updateTodo(todo.id, todo.content)}
                  style={{ backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '5px' }}>
                  ✏️
                </button>
                <button onClick={() => deleteTodo(todo.id)}
                  style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Todos
