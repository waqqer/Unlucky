import { HashRouter, Route, Routes, useLocation } from "react-router"
import { MainPage, NotFoundPage, TopPage, TermsPage, MinerGamePage, AdminPage, SlotsGamePage, RocketGamePage } from "@/pages"
import Modal from 'react-modal'
import { useContext, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import "./styles"
import UpdBalance from "../components/UpdBalance"

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

      <UpdBalance />

      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFoundPage />} />

        {(account?.role ?? "USER") === "ADMIN" && <Route path='/admin' element={<AdminPage />} />}

        <Route path='/slots' element={<SlotsGamePage />} />
        <Route path='/rocket' element={<RocketGamePage />} />
        <Route path='/miner' element={<MinerGamePage />} />

        <Route path='/top' element={<TopPage />} />
        <Route path='/terms' element={<TermsPage preview={true} />} />
      </Routes>
    </HashRouter>
  )
}

export default App
