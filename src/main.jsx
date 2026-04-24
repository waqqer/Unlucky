import { createRoot } from 'react-dom/client'
import { AccountProvider } from "@/context/AccountContext";
import { AppProvider } from '@/context/AppContext';
import App from './app'

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <AccountProvider>
      <App />
    </AccountProvider>
  </AppProvider>
)