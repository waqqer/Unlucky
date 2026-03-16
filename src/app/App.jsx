import { BrowserRouter, Route, Routes } from "react-router"
import "./styles"
import MainPage from "@/pages/MainPage"
import ErrorPage from "@/pages/ErrorPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Unlucky/' element={ <MainPage /> } />
        <Route path='*' element={ 
            <ErrorPage 
                link="/Unlucky/" 
                title="Упс! Кажется, здесь кто-то всё сломал..." 
                message="Страница, которую вы ищете, либо удалена, либо никогда не существовала!" 
                className="EnterFade"
            /> 
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
