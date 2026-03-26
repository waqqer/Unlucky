import { createRoot } from 'react-dom/client'
import { AccountProvider } from "@/context/AccountContext";
import App from './app'

createRoot(document.getElementById('root')).render(
  <AccountProvider>
    <App />
  </AccountProvider>
)