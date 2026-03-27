import GamesList from "@/components/GamesList"
import Container from "@/components/Container"
import styles from "./GamesSection.module.css"

const messages = [
    "Где тебе сегодня повезет?",
    "Где поиграем?",
    "Куда депнем?",
    "Опять додеп?",
    "Да начнутся лудоприключения!",
    "Бэм бэм бэм...",
    "Виноград, сливыыыыы яблоки на зеленых есть",
    "Не ну нормально еще посидим, еще посидим",
    "Миллион двести на балансе"
]

const GamesSection = () => {
    const title = messages[Math.round(Math.random() * messages.length - 1)]
    return (
        <Container>
            <h1 className={styles["game-rnd-message"]}>{title}</h1>
            <h1 className={styles["games-title"]}>Игры</h1>
            <GamesList />
        </Container>
    )
}

export default GamesSection