import type { UserPresence } from "@/Api/User"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext, useEffect, useState } from "react"
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
    const [username, setUsername] = useState<string>("Username")
    const [userBadge, setUserBadge] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (User) {
            setUsername(User.name)
            setUserBadge(User.current_badge)
            return
        } else if (DefaultUser) {
            setUsername(DefaultUser.username)
            setUserBadge(badge ?? undefined)
        }
    }, [DefaultUser, User, badge])

    return (
        <h4 className={`${styles.username} ${className}`} style={{
            justifyContent: reverse ? "end" : "start"
        }}>
            {!reverse ?
                <>
                    {username}
                    {withBadge && <Badge badgeName={userBadge} tooltip={badgeTooltip} tooltipDelay={200} size={badgeSize} />}
                    {withFire && <Streak tooltip={fireTooltip} />}
                    {children}
                </>
                :
                <>
                    {children}
                    {withFire && <Streak tooltip={fireTooltip} />}
                    {withBadge && <Badge badgeName={userBadge} tooltip={badgeTooltip} tooltipDelay={200} size={badgeSize} />}
                    {username}
                </>
            }
        </h4>
    )
}

export default memo(Username)
