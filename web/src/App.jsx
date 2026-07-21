import { Routes, Route } from 'react-router-dom'
import TicketList from './TicketList.jsx'
import TicketDetail from './TicketDetail.jsx'
import './App.css'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
      </Routes>
    </main>
  )
}

export default App
