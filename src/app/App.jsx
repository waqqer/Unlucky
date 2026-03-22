import { HashRouter, Route, Routes } from "react-router"
import { MainPage, NotFoundPage } from "@/pages"
import Modal from 'react-modal';
import "./styles"

Modal.setAppElement("#root")

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <MainPage /> } />
        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </HashRouter>
  )
}

export default App
