import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'      // ← 在这行引入 Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

