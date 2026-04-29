import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Portfolio from './routes/index'
import StackGame from './routes/stack'
import TipsPage from './routes/tips'
import GemShop from './routes/gems'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/stack" element={<StackGame />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/gems" element={<GemShop />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
