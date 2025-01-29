import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Css/index.css'
import './Css/App.css'
import App from './Components/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
