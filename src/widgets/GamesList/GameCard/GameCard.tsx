import type { GameInfo } from "@/Shared/Configs"
import type { Classable, Identical } from "@/Shared/Types/PropsTypes"
import { memo, useCallback } from "react"
import styles from "./GameCard.module.css"
import { useNavigate } from "react-router"
import Separator from "@/Components/Decorations/Separator/Separator"

interface UIGameCardProps extends Classable, Identical {
    game: GameInfo
}

const GameCard = (props: UIGameCardProps) => {
    const {
        className = "",
        id = "",
        game
    } = props

    const nav = useNavigate()

    const handleClick = useCallback(() => {
        nav(game.route)
    }, [game])

    return (
        <div
            className={`${styles.card} ${className}`}
            id={id}
            onClick={handleClick}
            style={{
                "--bg": `url(${game.icon})`
            } as React.CSSProperties}
        >
            <div className={styles.info}>
                <h1 className={styles.title}>{game.title}</h1>
                <Separator />
                {game.desc && <p className={styles.desc}>{game.desc}</p>}
            </div>
        </div>
    )
}

export default memo(GameCard)