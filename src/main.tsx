import { createRoot } from 'react-dom/client'
import App from "./App"
import Modal from "react-modal"
import { AuthProvider } from './Context/AuthContext'

Modal.setAppElement("#root")
createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <App />
    </AuthProvider>
)