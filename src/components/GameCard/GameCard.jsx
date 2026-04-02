import { useNavigate } from "react-router"
import { memo } from "react"
import styles from "./GameCard.module.css"

const GameCard = (props) => {
    const {
        link,
        title,
        desc,
        image
    } = props

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(link)
    }

    return (
        <div className={styles["game-card"]} onClick={handleClick}>
            <div className={styles["card-wrapper"]}>
                <div 
                    className={styles["card-bg"]} 
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            </div>
            <div className={styles["card-overlay"]}></div>
            <div className={styles.details}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.desc}>{desc}</p>
            </div>
        </div>
    )
}

export default memo(GameCard)
