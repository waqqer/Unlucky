import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal'
import AdminPage from "@/pages/AdminPage"
import SlotsGamePage from "@/pages/SlotsGamePage"
import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import "./styles"

Modal.setAppElement("#root")

function App() {

  const {
    account
  } = useContext(AccountContext)

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFoundPage />} />

        {(account?.role ?? "ADMIN") === "ADMIN" && <Route path='/admin' element={ <AdminPage /> } />}

        <Route path='/slots' element={<SlotsGamePage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
