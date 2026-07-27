import { useEffect, useState } from 'react'
import { countOpenTickets } from './lib/api.js'

function OpenTicketsCount() {
  const [openCount, setOpenCount] = useState(null)

  useEffect(() => {
    countOpenTickets()
      .then(({ open }) => setOpenCount(open))
      .catch((err) => console.error(err.message))
  }, [])

  if (openCount === null) return null

  return <p>Open tickets: {openCount}</p>
}

export default OpenTicketsCount
