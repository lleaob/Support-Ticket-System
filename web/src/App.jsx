import { useState } from 'react'
import { useAuth } from './auth/authContext.js'
import LoginForm from './auth/LoginForm.jsx'
import TicketList from './TicketList.jsx'
import TicketDetail from './TicketDetail.jsx'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const { user, loading, signOut } = useAuth()

  // This gate is a UX convenience only, not a security boundary: it just
  // decides what renders in the browser. It has no bearing on whether the
  // API returns data — that's enforced entirely server-side.
  if (loading) {
    return <p className="loading-screen">Loading…</p>
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <main>
      <header className="app-header">
        <span className="app-header__account">Support Desk</span>
        <button type="button" className="btn btn-text" onClick={signOut}>Sign out</button>
      </header>
      {selectedId == null
        ? <TicketList onSelect={setSelectedId} />
        : <TicketDetail id={selectedId} onBack={() => setSelectedId(null)} />}
    </main>
  )
}

export default App
