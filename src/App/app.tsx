import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"
import "./styles"
import NotFoundPage from "@/Pages/NotFound/NotFoundPage"

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFoundPage /> } />
            </Routes>
        </HashRouter>
    )
}

export default App