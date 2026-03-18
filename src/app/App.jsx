import { HashRouter, Route, Routes } from "react-router"
import "./styles"
import { AboutUsPage, MainPage, NotFoundPage } from "@/pages"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <MainPage /> } />
        <Route path='/AboutUs' element={ <AboutUsPage /> } />
        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </HashRouter>
  )
}

export default App
