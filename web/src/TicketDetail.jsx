import { useEffect, useState } from 'react'
import { fetchTicket } from './lib/api.js'

function TicketDetail({ id, onBack }) {
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTicket(id)
      .then(setTicket)
      .catch((err) => setError(err.message))
  }, [id])

  return (
    <>
      <button type="button" onClick={onBack}>Back to list</button>
      {error ? (
        <p>Failed to load ticket: {error}</p>
      ) : !ticket ? null : (
        <>
          <h1>{ticket.subject}</h1>
          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Requester: {ticket.requester}</p>
          <p>{ticket.description}</p>
        </>
      )}
    </>
  )
}

export default TicketDetail
