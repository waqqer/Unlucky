import { createRoot } from 'react-dom/client'
import App from "./App"
import Modal from "react-modal"
import { AuthProvider } from './Context/AuthContext'
import { OnlineProvider } from './Context/OnlineContext'
import { Flip, ToastContainer } from 'react-toastify'
import { AccountProvider } from './Context/AccountContext'
import { SettingsProvider } from './Context/SettingsContext'
import { MessangerProvider } from './Context/MessangerContext'
import BadgeNotification from './Components/Notifications/BadgeNotification'

Modal.setAppElement("#root")
createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <SettingsProvider>
            <AccountProvider>
                <MessangerProvider>
                    <OnlineProvider>
                        <App />

                        <BadgeNotification />

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={true}
                            theme="dark"
                            closeOnClick
                            draggable
                            pauseOnFocusLoss={false}
                            transition={Flip}
                        />
                    </OnlineProvider>
                </MessangerProvider>
            </AccountProvider>
        </SettingsProvider>
    </AuthProvider>
)