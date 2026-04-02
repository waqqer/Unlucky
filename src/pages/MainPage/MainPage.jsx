import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
import GamesSection from "@/widgets/GamesSection"
import styles from "./MainPage.module.css"
import PaymentApi from "../../api/payment"

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

            <footer className={`${styles.footer} mobile-hide`}>
                <p>ООО "Тмыв денег"</p>
            </footer>
        </>
    )
}

export default MainPage