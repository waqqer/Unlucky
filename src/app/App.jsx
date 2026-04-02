import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal'
import AdminPage from "@/pages/AdminPage"
import SlotsGamePage from "@/pages/SlotsGamePage"
import { useContext, useEffect, useRef } from "react"
import { AccountContext } from "@/context/AccountContext"
import OnlineApi from "@/api/online"
import "./styles"

Modal.setAppElement("#root")

function App() {

  const {
    account,
    isLoaded
  } = useContext(AccountContext)

  const hasIncremented = useRef(false)

  useEffect(() => {
    if (hasIncremented.current) return

    hasIncremented.current = true
    OnlineApi.increment()
      .catch(err => console.error("Failed to increment online:", err))

    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        OnlineApi.URL + "/decrement",
        JSON.stringify({})
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoaded])

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFoundPage />} />

        {(account?.role ?? "USER") === "ADMIN" && <Route path='/admin' element={ <AdminPage /> } />}

        <Route path='/slots' element={<SlotsGamePage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
