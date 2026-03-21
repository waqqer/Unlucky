import Title from "@/components/Title"
import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
import GameCard from "../../components/GameCard"
import GamesList from "../../components/GamesList"
import GamesSection from "@/widgets/GamesSection"

const MainPage = () => {
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