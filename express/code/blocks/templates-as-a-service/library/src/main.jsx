import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Function to initialize the app
export function initTemplatesAsAService(containerId = 'root') {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container with id "${containerId}" not found`)
    return
  }
  
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  
  return root
}

// Auto-initialize if running in browser and root element exists
if (typeof window !== 'undefined' && document.getElementById('root')) {
  initTemplatesAsAService('root')
}
