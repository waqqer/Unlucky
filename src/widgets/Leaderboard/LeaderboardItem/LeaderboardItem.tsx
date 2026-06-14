import { memo } from "react"
import styles from "./LeaderboardItem.module.css"
import Head from "@/Components/Decorations/Head"
import useSound from "@/Hooks/useSound"
import hoverSound from "@/Shared/Assets/Audio/hover.mp3"

interface UILeaderboardItemProps {
    text: string,
    value: number
}

const LeaderboardItem = (props: UILeaderboardItemProps) => {
    const {
        text,
        value
    } = props

    const sound = useSound(hoverSound, {
        volume: 0.003
    })
    
    return (
        <div className={styles.item} onMouseEnter={sound.play}>
            <h1 className={styles.place}>
                <span>#</span>
                1
            </h1>

            <div className={styles.info}>
                <div className={styles.data}>
                    <h1 className={styles.nick}>PlayerPlayer1234</h1>
                    <p className={styles.desc}>
                        {text}:
                        <span>{value}</span>
                    </p>
                </div>

                <Head size={40}/>
            </div>
        </div>
    )
}

export default memo(LeaderboardItem)