import { memo } from "react"
import styles from "./LeaderboardItem.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"
import Head from "@/Components/Decorations/Head"
import Username from "@/Components/User/Username"
import useSound from "@/Hooks/useSound"
import hoverSound from "@/Shared/Assets/Audio/hover.mp3"

interface LeaderboardItemProps extends Classable {
    data: any,
    valueName?: string
}

const LeaderboardItem = (props: LeaderboardItemProps) => {
    const {
        className = "",
        data,
        valueName = "Побед"
    } = props

    const { play } = useSound(hoverSound, {
        volume: 0.005
    })

    return (
        <div className={`${styles.item} ${className}`} onMouseEnter={play}>
            <div className={styles.user}>
                <Head size={48}/>
                <Username userName={data} withFire={false} />
            </div>

            <div className={styles.value}>
                <span>{data}</span>
                <span>{valueName && valueName}</span>
            </div>
        </div>
    )
}

export default memo(LeaderboardItem)