import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"
import "./styles"
import AdminPage from "@/Pages/Admin/AdminPage"

const App = () => {
    return (
        <HashRouter>
            <Routes>
                
                <Route path="/" element={<MainPage/>} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </HashRouter>
    )
}

export default App