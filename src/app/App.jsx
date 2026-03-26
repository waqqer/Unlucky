import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal';
import { AccountProvider } from "@/context/AccountContext";
import AdminPage from "@/pages/AdminPage";
import "./styles"

Modal.setAppElement("#root")

function App() {
  const isAdmin = false
  return (
    <AccountProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={ <MainPage /> } />
          <Route path='*' element={ <NotFoundPage /> } />
          
          {isAdmin && <Route path='/admin' element={ <AdminPage /> } />}
        </Routes>
      </HashRouter>
    </AccountProvider>
  )
}

export default App
