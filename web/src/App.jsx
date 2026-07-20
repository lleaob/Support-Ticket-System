import { useEffect, useState } from 'react'
import { fetchTickets } from './api.js'
import './App.css'

function App() {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>Support Desk</h1>
      {error ? (
        <p>Failed to load tickets: {error}</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              {ticket.subject} — {ticket.status} — {ticket.priority}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
