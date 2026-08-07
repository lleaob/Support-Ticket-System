import { useEffect, useState } from 'react'
import { useAuth } from './auth/authContext.js'
import { fetchTicket } from './lib/api.js'

function TicketDetail({ id, onBack }) {
  const { token, user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTicket(id, token)
      .then(setTicket)
      .catch((err) => setError(err.message))
  }, [id, token])

  const isOwner = ticket && ticket.requester === user.email
  const isAssignee = ticket && ticket.assignee === user.email

  return (
    <>
      
      {error ? (
        <p className="form-error">Failed to load ticket: {error}</p>
      ) : !ticket ? (
        <p className="empty-state">Ticket not found.</p>
      ) : (
        <>
          <h1 className="ticket-detail__title">{ticket.subject}</h1>
          {isOwner ? (
            <h2 className="ticket-section__heading">Raised</h2>
          ) : isAssignee ? (
            <h2 className="ticket-section__heading">Task</h2>
          ) : null}
          <p className="ticket-detail__meta">Status: {ticket.status}</p>
          <p className="ticket-detail__meta">Priority: {ticket.priority}</p>
          <p className="ticket-detail__meta">Requester: {ticket.requester}</p>
          <p className="ticket-detail__description">{ticket.description}</p>
        </>
      )}
      <button type="button" className="btn btn-text" onClick={onBack}>Back to list</button>
    </>
  )
}

export default TicketDetail
