import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTickets } from './api.js'

function TicketList() {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <h1>Support Desk</h1>
      {error ? (
        <p>Failed to load tickets: {error}</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link to={`/tickets/${ticket.id}`}>
                {ticket.subject} — {ticket.status} — {ticket.priority}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TicketList
