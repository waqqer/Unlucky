import { createRoot } from 'react-dom/client'
import App from "./App"
import Modal from "react-modal"
import { AuthProvider } from './Context/AuthContext'
import { OnlineProvider } from './Context/OnlineContext'
import { Slide, ToastContainer } from 'react-toastify'
import { AccountProvider } from './Context/AccountContext'

Modal.setAppElement("#root")
createRoot(document.getElementById('root')!).render(
    <>
        <AuthProvider>
            <AccountProvider>
                <OnlineProvider>
                    <App />

                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        theme="dark"
                        closeOnClick
                        draggable
                        pauseOnFocusLoss
                        transition={Slide}
                    />
                </OnlineProvider>
            </AccountProvider>
        </AuthProvider>
    </>
)