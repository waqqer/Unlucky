import GamesList from "@/components/GamesList"
import styles from "./GamesSection.module.css"
import Container from "../../components/Container"

const messages = [
    "Где тебе сегодня повезет?",
    "Где поиграем?",
    "Куда депнем?",
    "Опять додеп?",
    "Да начнутся лудоприключения!",
    "Бэм бэм бэм...",
    "Иди нахуй отсюда бабка ебаная",
    "Виноград, сливыыыыы яблоки на зеленых есть",
    "Не ну нормально еще посидим, еще посидим",
    "Лан все последний дэп блять",
    "Бля давай, эх ты сука",
    "Блять, миллион двести на балансе",
    "Я уже красный, культурно не получиться нахуй"
]

const GamesSection = () => {
    const title = messages[Math.round(Math.random() * messages.length)]
    return (
        <Container>
            <h1 className={styles["game-rnd-message"]}>{title}</h1>
            <h1 className={styles["games-title"]}>Игры</h1>
            <GamesList />
        </Container>
    )
}

export default GamesSection