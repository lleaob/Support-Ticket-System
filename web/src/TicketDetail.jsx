import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchTicket } from './api.js'

function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    fetchTicket(id).then(setTicket)
  }, [id])

  if (!ticket) {
    return null
  }

  return (
    <>
      <h1>{ticket.subject}</h1>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Requester: {ticket.requester}</p>
      <Link to="/">Back to list</Link>
    </>
  )
}

export default TicketDetail
