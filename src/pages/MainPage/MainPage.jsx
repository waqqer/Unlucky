import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
import GamesSection from "@/widgets/GamesSection"
import { use, useEffect } from "react"
import BalanceApi from "../../api/balance"

const MainPage = () => {

    useEffect(() => {
        // for test
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