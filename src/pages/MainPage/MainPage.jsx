import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
import GamesSection from "@/widgets/GamesSection"
import { use, useEffect } from "react"
import BalanceApi from "../../api/balance"
import StatsApi from "../../api/statistics"
import HistoryApi from "../../api/history"
import UserApi from "../../api/users"

const MainPage = () => {

    useEffect(() => {
        // for test
        UserApi.getOrCreate({
            username: "next",
            minecraftUUID: "asdasd"
        }, "USER")
        HistoryApi.getAll().then(d => console.log(d))
        HistoryApi.getByName('next').then(d => console.log(d))
        HistoryApi.create('next', "слоты", "WIN", 2)
    }, [])

    return (
        <>
            <header>
                <UserProfile />
            </header>

            <main>
                <MainTitle />
                <GamesSection />
            </main>
        </>
    )
}

export default MainPage