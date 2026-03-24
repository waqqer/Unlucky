import GamesList from "@/components/GamesList"
import styles from "./GamesSection.module.css"

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
        <section className={styles["games-section"]}>
            <h1 className={`title ${styles["game-rnd-message"]}`}>{title}</h1>
            <GamesList />
        </section>
    )
}

export default GamesSection