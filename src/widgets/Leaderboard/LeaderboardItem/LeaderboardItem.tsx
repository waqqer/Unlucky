import { memo } from "react"
import styles from "./LeaderboardItem.module.css"
import Head from "@/Components/Decorations/Head"
import useSound from "@/Hooks/useSound"
import hoverSound from "@/Shared/Assets/Audio/hover.mp3"

interface UILeaderboardItemProps {
    text: string,
    value: number,
    uuid: string,
    name: string,
    index: number
}

const LeaderboardItem = (props: UILeaderboardItemProps) => {
    const {
        text,
        value,
        index,
        name,
        uuid
    } = props

    const sound = useSound(hoverSound, {
        volume: 0.003
    })
    
    return (
        <div className={styles.item} onMouseEnter={sound.play}>
            <h1 className={styles.place}>
                <span>#</span>
                {index}
            </h1>

            <div className={styles.info}>
                <div className={styles.data}>
                    <h1 className={styles.nick}>{name}</h1>
                    <p className={styles.desc}>
                        {text}:
                        <span>{value}</span>
                    </p>
                </div>

                <Head size={40} uuid={uuid}/>
            </div>
        </div>
    )
}

export default memo(LeaderboardItem)