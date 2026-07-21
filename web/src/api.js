export async function fetchTickets() {
  const res = await fetch('/api/tickets')
  if (!res.ok) {
    throw new Error(`Failed to fetch tickets: ${res.status}`)
  }
  return res.json()
}

export async function fetchTicket(id) {
  const res = await fetch(`/api/tickets/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch ticket: ${res.status}`)
  }
  return res.json()
}
