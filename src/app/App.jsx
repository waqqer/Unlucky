import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal'
import AdminPage from "@/pages/AdminPage"
import SlotsGamePage from "@/pages/SlotsGamePage"
import RocketGamePage from "@/pages/RocketGamePage"
import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import MinerGamePage from "../pages/MinerGamePage"
import TermsPage from "../pages/TermsPage"
import TopPage from "../pages/TopPage"
import "./styles"

Modal.setAppElement("#root")

function App() {
  const {
    account,
    termsAccepted
  } = useContext(AccountContext)

  if (!termsAccepted()) {
    return (
      <HashRouter>
        <Routes>
          <Route path='/' element={<TermsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFoundPage />} />

        {(account?.role ?? "USER") === "ADMIN" && <Route path='/admin' element={<AdminPage />} />}

        <Route path='/slots' element={<SlotsGamePage />} />
        <Route path='/rocket' element={<RocketGamePage />} />
        <Route path='/miner' element={<MinerGamePage />} />

        <Route path='/top' element={<TopPage />} />
        <Route path='/terms' element={<TermsPage preview={true}/>} />
      </Routes>
    </HashRouter>
  )
}

export default App
