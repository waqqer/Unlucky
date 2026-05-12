import UserProfile from "@/widgets/UserProfile"
import styles from "./TopPage.module.css"
import Leaderboard from "@/components/Leaderboard";
import { useEffect, useState } from "react";
import TopApi from "@/api/top";
import Button from "@/components/Button"
import { useNavigate } from "react-router";

const limits = {
    byGames: 20,
    byWins: 20,
    byBalance: 20
}

const TopPage = () => {
    const [games, setGames] = useState([])
    const [wins, setWins] = useState([])
    const [balance, setBalance] = useState([])

    useEffect(() => {
        TopApi.getByBalance(limits.byBalance).then(d => setBalance(d))
        TopApi.getByGames(limits.byGames).then(d => setGames(d))
        TopApi.getByWins(limits.byWins).then(d => setWins(d))
    }, [])

    const nav = useNavigate()

    const handleGoHome = () => {
        nav('/')
    }

    return (
        <>
            <header>
                <UserProfile />
            </header>

            <Button className={`${styles["home-btn"]} mobile-hide back-style`} onClick={handleGoHome}>
                <i className="fa-solid fa-arrow-left"></i>
                <span>Главная</span>
            </Button>

            <main className={styles.main}>
                <h1 className={styles.title}>Рейтинг</h1>
                <div className={styles.content}>
                    <Leaderboard data={games} title="По играм"/>
                    <Leaderboard data={balance} title="По балансу" />
                    <Leaderboard data={wins} title="По победам" />
                </div>
            </main>
        </>
    )
}

export default TopPage