import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal'
import AdminPage from "@/pages/AdminPage"
import SlotsGamePage from "@/pages/SlotsGamePage"
import { useContext, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import OnlineApi from "@/api/online"
import "./styles"

Modal.setAppElement("#root")

function App() {

  const {
    account,
    isLoaded
  } = useContext(AccountContext)

  useEffect(() => {
    

    OnlineApi.increment()
      .catch(err => console.error("Failed to increment online:", err))

    return () => {
      OnlineApi.decrement()
        .catch(err => console.error("Failed to decrement online:", err))
    }
  })

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
