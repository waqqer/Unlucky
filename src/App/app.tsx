import { HashRouter, Routes, Route } from "react-router"
import { MainPage } from "@/Pages"
import "./styles"
import NotFoundPage from "@/Pages/NotFound/NotFoundPage"
import SlotsPage from "@/Pages/Slots/SlotsPage"
import MinerPage from "@/Pages/Miner/MinerPage"
import BombPage from "@/Pages/Bomb/BombPage"
import { useContext } from "react"
import { AccountContext } from "@/Context/AccountContext"
import PolicyPage from "@/Pages/PolicyPage"
import AdminPage from "@/Pages/Admin"

const App = () => {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
    }

    const { policy, role } = useContext(AccountContext)
    
    if (policy && !policy.policy_accepts) {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<PolicyPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </HashRouter>
        )
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFoundPage />} />

                <Route path="/slots" element={<SlotsPage />} />
                <Route path="/miner" element={<MinerPage />} />
                <Route path="/bombs" element={<BombPage />} />

                {role === "ADMIN" && <Route path="/admin" element={<AdminPage />} />}
            </Routes>
        </HashRouter>
    )
}

export default App