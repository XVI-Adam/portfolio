import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Portfolio from './routes/index'
import StackGame from './routes/stack'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/stack" element={<StackGame />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
