import UserProfile from "@/widgets/UserProfile"
import MainTitle from "@/widgets/MainTitle"
import GamesSection from "@/widgets/GamesSection"
import styles from "./MainPage.module.css"
import BadgeMessage from "../../components/BadgeMessage/BadgeMessage";

const MainPage = () => {
    return (
        <div className={styles.main}>
            <header>
                <UserProfile />
            </header>

            <main className={styles.content}>
                <MainTitle />
                <GamesSection />
            </main>

            <footer className={`${styles.footer} mobile-hide`}>
                <p>ООО "Тмыв денег"</p>
            </footer>
        </div>
    )
}

export default MainPage