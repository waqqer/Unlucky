import type { UserPresence } from "@/Api/User"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext } from "react"
import styles from "./Username.module.css"
import Badge from "@/widgets/Badge/Badge"
import { AccountContext } from "@/Context/AccountContext"
import Streak from "@/widgets/Streak/Streak/Streak"

interface UIUsernameProps extends Classable, Parent {
    User?: UserPresence
    withBadge?: boolean
    withFire?: boolean
    badgeTooltip?: boolean
    fireTooltip?: boolean
    reverse?: boolean
    badgeSize?: number
}

const Username = (props: UIUsernameProps) => {
    const {
        className = "",
        children,
        User,
        withBadge = false,
        badgeTooltip = false,
        withFire = false,
        fireTooltip = false,
        reverse = false,
        badgeSize = 32
    } = props

    const { user: DefaultUser, badge } = useContext(AccountContext)
    const username = User?.name ?? DefaultUser?.username ?? "Username"
    const userBadge = User?.current_badge ?? badge ?? undefined

    return (
        <h4 className={`${styles.username} ${className}`} style={{
            justifyContent: reverse ? "end" : "start"
        }}>
            {!reverse ?
                <>
                    <span className={styles.name}>{username}</span>
                    {withBadge && <Badge badgeName={userBadge} tooltip={badgeTooltip} tooltipDelay={200} size={badgeSize} />}
                    {withFire && <Streak tooltip={fireTooltip} />}
                    {children}
                </>
                :
                <>
                    {children}
                    {withFire && <Streak tooltip={fireTooltip} />}
                    {withBadge && <Badge badgeName={userBadge} tooltip={badgeTooltip} tooltipDelay={200} size={badgeSize} />}
                    <span className={styles.name}>{username}</span>
                </>
            }
        </h4>
    )
}

export default memo(Username)
