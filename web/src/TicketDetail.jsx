import { useParams } from 'react-router-dom'

function TicketDetail() {
  const { id } = useParams()

  return (
    <>
      <h1>Ticket #{id}</h1>
      <p>Detail view coming soon.</p>
    </>
  )
}

export default TicketDetail
