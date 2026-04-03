import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Backend bekleniyor...')

  useEffect(() => {
    // Vite üzerinden geliştirme ortamında proxy kullanılabilir, 
    // ancak container ortamında genelde environment variables veya doğrudan API adresi kullanılır.
    // Şimdilik backend API URL'sine istek atıyoruz.
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    
    fetch(`${apiUrl}/api/status`)
      .then(res => res.json())
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
