import { useNavigate } from "react-router"
import { memo, useCallback } from "react"
import styles from "./GameCard.module.css"

const GameCard = (props) => {
    const {
        link,
        title,
        desc,
        image,
        className = "",
        enable=true
    } = props

    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        if(enable)
            navigate(link)
    }, [link, navigate, enable])

    return (
        <div className={`${styles["game-card"]} ${className}`} onClick={handleClick}>
            <div 
                className={styles["card-image"]} 
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className={styles.details}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.desc}>{desc}</p>
                {enable === false && <p className={styles.disable}>Временно не работает!</p>}
            </div>
        </div>
    )
}

export default memo(GameCard)
