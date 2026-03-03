import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SPWMini from 'spwmini/client'
import './index.css'
import App from './App.jsx'

export const spm = new SPWMini('')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
