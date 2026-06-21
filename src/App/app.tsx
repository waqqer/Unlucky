import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"
import "./styles"
import NotFoundPage from "@/Pages/NotFound/NotFoundPage"
import SlotsPage from "@/Pages/Slots/SlotsPage"
import MinerPage from "@/Pages/Miner/MinerPage"
import BombPage from "@/Pages/Bomb/BombPage"

const App = () => {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFoundPage />} />

                <Route path="/slots" element={<SlotsPage />} />
                <Route path="/miner" element={<MinerPage />} />
                <Route path="/bombs" element={<BombPage />} />
            </Routes>
        </HashRouter>
    )
}

export default App