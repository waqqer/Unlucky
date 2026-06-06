import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"

const App = () => {
    return (
        <HashRouter>
            <Routes>
                
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App