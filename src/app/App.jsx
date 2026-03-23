import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal';
import "./styles"
import { AccountProvider } from "../context/AccountContext";

Modal.setAppElement("#root")

function App() {
  return (
    <AccountProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </AccountProvider>
  )
}

export default App
