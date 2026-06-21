import { memo, useContext } from "react"
import styles from "./LeaderboardItem.module.css"
import Head from "@/Components/Decorations/Head"
import useSound from "@/Hooks/useSound"
import hoverSound from "@/Shared/Assets/Audio/hover.mp3"
import Username from "@/Components/Info/Username"
import { AccountContext } from "@/Context/AccountContext"

interface UILeaderboardItemProps {
    text: string,
    value: number,
    uuid: string,
    name: string,
    index: number,
    badge: string
}

const LeaderboardItem = (props: UILeaderboardItemProps) => {
    const {
        text,
        value,
        index,
        name,
        uuid,
        badge
    } = props

    const sound = useSound(hoverSound, {
        volume: 0.003
    })

    const { account, badge: userBadge } = useContext(AccountContext)
    
    return (
        <div className={styles.item} onMouseEnter={sound.play}>
            <h1 className={styles.place}>
                <span>#</span>
                {index}
            </h1>

            <div className={styles.info}>
                <div className={styles.data}>
                    <Username className={styles.nick} withBadge badgeTooltip User={{
                        name: name,
                        current_badge: account?.UUID === uuid ? userBadge : badge
                    }}/>
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