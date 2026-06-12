import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"
import "./styles"
import AdminPage from "@/Pages/Admin/AdminPage"
import { Slide, ToastContainer } from "react-toastify"

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                theme="dark"
                closeOnClick
                draggable
                pauseOnFocusLoss
                transition={Slide}
            />
        </HashRouter>
    )
}

export default App