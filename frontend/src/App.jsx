import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Backend bekleniyor...')

  useEffect(() => {

    fetch('/api/status')
      .then(res => {
        if (!res.ok) throw new Error('Sunucu hatası: ' + res.status);
        return res.json();
      })
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Backend\'e ulaşılamadı. ' + err.message))
  }, [])

  return (
    <div className="App">
      <h1>To-Do App (Frontend)</h1>
      <div className="card">
        <p><strong>Backend Durumu:</strong> {status}</p>
      </div>
      <p className="read-the-docs">
        DevOps Task 2 - 3 Katmanlı Mimari İskeleti
      </p>
    </div>
  )
}

export default App
