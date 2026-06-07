import type { GameInfo } from "@/Shared/Configs"
import { memo, useCallback } from "react"
import { useNavigate } from "react-router"
import styles from "./GameCard.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface GameCardProps extends Classable {
    className?: string,
    gameData: GameInfo
}

const GameCard = (props: GameCardProps) => {
    const {
        className = "",
        gameData
    } = props

    const nav = useNavigate()

    const handleClick = useCallback(() => {
        nav(gameData.route)
    }, [])

    return (
        <div className={`${styles["game-card"]} ${className}`} onClick={handleClick} onAnimationEnd={(ev) => {
            ev.currentTarget.classList.add(styles.showed)
        }}>
            <div
                className={styles["card-image"]}
                style={{ backgroundImage: `url(${gameData.icon})` }}
            >

            </div>
            <div className={styles.details}>
                <h3 className={styles.title}>{gameData.title}</h3>
                {gameData.desc && <p className={styles.desc}>{gameData.desc}</p>}
            </div>
        </div>
    )
}

export default memo(GameCard)