import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SalonProvider } from './contexts/SalonContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SalonProvider>
          <App />
        </SalonProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
