import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './css/global.css'
// import 'node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
