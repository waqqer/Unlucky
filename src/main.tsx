import { createRoot } from 'react-dom/client'
import App from "./App"
import Modal from "react-modal"
import { SpProvider } from './Context/SpContext'

Modal.setAppElement("#root")
createRoot(document.getElementById('root')!).render(
    <SpProvider>
        <App />
    </SpProvider>
)