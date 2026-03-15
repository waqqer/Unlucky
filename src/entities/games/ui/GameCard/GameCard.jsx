import { Link } from "react-router"
import styles from "./GameCard.module.css"

const GameCard = (props) => {
    const {
        title,
        desc,
        link
    } = props

    return (
        <div className={styles.gameCard}>
            <div className={styles.gameDetails}>
                <h3 className={styles.gameTitle}>{title}</h3>
                <p className={styles.gameDesc}>
                    {desc}
                </p>

                <Link to={link}>Играть</Link>
            </div>
        </div>
    )
}

export default GameCard