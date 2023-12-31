import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LoginInfoContext } from './Contexts/LoginContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <LoginInfoContext>
        <App />
    </LoginInfoContext>

)
