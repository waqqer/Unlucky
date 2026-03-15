import { BrowserRouter, Route, Routes } from "react-router"
import "./styles"
import MainPage from "@/pages/MainPage"
import ErrorPage from "@/pages/ErrorPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Unlucky/' element={ <MainPage /> } />
        <Route path='*' element={ <ErrorPage link="/Unlucky/" title="404" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
