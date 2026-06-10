import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";

// Auto-seed Super Admin token for development convenience
if (!localStorage.getItem('token')) {
  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjlhMTNlMTIxOWJkOTVkNDU1ZjMyYiIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc4MTExMzE1MSwiZXhwIjoxNzgxMTk5NTUxfQ.T32RqchFUr8frYjFdo0RIdrCD58Jy2T4on0l_wYpOsw');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#1e293b",
          border: "1px solid #f97316",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    />
    <App />
  </StrictMode>,
)
