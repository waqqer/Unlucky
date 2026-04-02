import Container from "@/components/Container"
import Button from "@/components/Button"
import { useNavigate } from "react-router"
import OnlineStats from "@/widgets/OnlineStats"
import ArStats from "@/widgets/ArStats"
import GamesStats from "@/widgets/GamesStats"
import styles from "./AdminPanel.module.css"

const AdminPanel = () => {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
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
                    <Button className={`${styles["home-btn"]} pc-hide back-style`} onClick={handleGoHome}>
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>На главную</span>
                    </Button>
                </div>
            </Container>
        </>
    )
}

export default AdminPanel
