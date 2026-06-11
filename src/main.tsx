import { createRoot } from 'react-dom/client'
import App from "./App"
import Modal from "react-modal"
import { AuthProvider } from './Context/AuthContext'
import { OnlineProvider } from './Context/OnlineContext'

Modal.setAppElement("#root")
createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <OnlineProvider>
            <App />
        </OnlineProvider>
    </AuthProvider>
)