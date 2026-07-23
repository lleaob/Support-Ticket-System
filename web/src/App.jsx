import { useState } from 'react'
import TicketList from './TicketList.jsx'
import TicketDetail from './TicketDetail.jsx'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <main>
      {selectedId == null
        ? <TicketList onSelect={setSelectedId} />
        : <TicketDetail id={selectedId} onBack={() => setSelectedId(null)} />}
    </main>
  )
}

export default App
