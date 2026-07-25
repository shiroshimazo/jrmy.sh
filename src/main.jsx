import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SoundProvider } from '@web-kits/audio/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </StrictMode>,
)
