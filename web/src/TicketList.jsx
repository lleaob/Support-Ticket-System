import { useEffect, useState } from 'react'
import { fetchTickets, countOpenTickets } from './lib/api.js'

function TicketList({ onSelect }) {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err) => setError(err.message))

    countOpenTickets()
      .then((result) => console.log(result))
      .catch((err) => console.error(err.message))
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
              <button type="button" onClick={() => onSelect(ticket.id)}>
                {ticket.subject} — {ticket.status} — {ticket.priority}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TicketList
