import type { GameInfo } from "@/Shared/Configs"
import type { Classable, Identical } from "@/Shared/Types/PropsTypes"
import { memo, useCallback } from "react"
import styles from "./GameCard.module.css"
import { useNavigate } from "react-router"
import Separator from "@/Components/Decorations/Separator/Separator"
import useSound from "@/Hooks/useSound"
import sound from "@/Shared/Assets/Audio/hover.mp3"

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
    const hoverSound = useSound(sound, {
        volume: 0.005
    })

    const handleClick = useCallback(() => {
        nav(game.route)
    }, [game, nav])

    return (
        <div
            className={`${styles.card} ${className}`}
            id={id}
            onClick={handleClick}
            onMouseEnter={() => hoverSound.play()}
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