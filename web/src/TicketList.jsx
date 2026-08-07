import { useEffect, useState } from 'react'
import { useAuth } from './auth/authContext.js'
import { fetchTickets } from './lib/api.js'

const STATUS_OPTIONS = ['open', 'pending', 'closed']
const PRIORITY_OPTIONS = ['low', 'medium', 'high']

function TicketGroup({ heading, tickets, onSelect }) {
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')

  const filtered = tickets.filter(
    (ticket) =>
      (status === 'all' || ticket.status === status) &&
      (priority === 'all' || ticket.priority === priority),
  )

  return (
    <section className="ticket-section">
      <h2 className="ticket-section__heading">{heading}</h2>
      <div className="ticket-filters">
        <label className="ticket-filters__field">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="ticket-filters__field">
          Priority
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="all">All</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <p className="empty-state">No tickets match these filters.</p>
      ) : (
        <ul className="ticket-list">
          {filtered.map((ticket) => (
            <li key={ticket.id} className="ticket-list__item">
              <button type="button" className="ticket-list__button" onClick={() => onSelect(ticket.id)}>
                {ticket.subject}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function TicketList({ onSelect }) {
  const { token, user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets(token)
      .then(setTickets)
      .catch((err) => setError(err.message))
  }, [token])

  const owned = tickets.filter((ticket) => ticket.requester === user.email)
  const assigned = tickets.filter((ticket) => ticket.assignee === user.email)

  return (
    <>
      <h1 className="page-title">My Tickets ({tickets.length})</h1>
      {error ? (
        <p className="form-error">Failed to load tickets: {error}</p>
      ) : tickets.length === 0 ? (
        <p className="empty-state">You have no tickets.</p>
      ) : (
        <>
          {owned.length > 0 && <TicketGroup heading="Raised" tickets={owned} onSelect={onSelect} />}
          {assigned.length > 0 && <TicketGroup heading="Task" tickets={assigned} onSelect={onSelect} />}
        </>
      )}
    </>
  )
}

export default TicketList
