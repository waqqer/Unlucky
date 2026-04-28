import Container from "@/components/Container"
import Button from "@/components/Button"
import { useNavigate } from "react-router"
import OnlineStats from "@/widgets/OnlineStats"
import ArStats from "@/widgets/ArStats"
import GamesStats from "@/widgets/GamesStats"
import UserStats from "../UserStats"
import styles from "./AdminPanel.module.css"

const AdminPanel = () => {
    const nav = useNavigate()

    const handleGoHome = () => {
        nav('/')
    }

    return (
        <>
            <Button className={`${styles["home-btn-pc"]} mobile-hide back-style`} onClick={handleGoHome}>
                <i className="fa-solid fa-arrow-left"></i>
                <span>Главная</span>
            </Button>
            <Container className={styles["admin-box"]}>
                <div className={styles["admin-panel"]}>
                    <OnlineStats />
                    <ArStats />
                    <GamesStats />
                    <UserStats />
                    <Button className={`${styles["home-btn"]} pc-hide`} onClick={handleGoHome}>
                        <span>На главную</span>
                    </Button>
                </div>
            </Container>
        </>
    )
}

export default AdminPanel
