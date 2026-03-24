import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
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