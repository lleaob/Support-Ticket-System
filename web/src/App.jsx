import { useState } from 'react'
import TicketList from './TicketList.jsx'
import TicketDetail from './TicketDetail.jsx'
import OpenTicketsCount from './OpenTicketsCount.jsx'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <main>      
      {selectedId == null
        ? <TicketList onSelect={setSelectedId} />
        : <TicketDetail id={selectedId} onBack={() => setSelectedId(null)} />}
      <footer>
        <OpenTicketsCount />
      </footer>
    </main>
  )
}

export default App
