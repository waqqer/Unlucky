import type { UserPresence } from "@/Api/User"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext, useEffect, useState } from "react"
import styles from "./Username.module.css"
import Badge from "@/widgets/Badge/Badge"
import { AccountContext } from "@/Context/AccountContext"

interface UIUsernameProps extends Classable, Parent {
    User?: UserPresence,
    withBadge?: boolean,
    withFire?: boolean,
    badgeTooltip?: boolean
}

const Username = (props: UIUsernameProps) => {
    const {
        className = "",
        children,
        User,
        withBadge = false,
        badgeTooltip = false,
        withFire = false
    } = props

    const { userInfo, user: DefaultUser } = useContext(AccountContext)
    const [username, setUsername] = useState<string>("Username")
    const [userBadge, setUserBadge] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (User) {
            setUsername(User.name)
            setUserBadge(User.current_badge)
            return
        } else if (DefaultUser) {
            setUsername(DefaultUser.username)
            setUserBadge(userInfo?.current_badge || undefined)
        }
    }, [DefaultUser, User, userInfo])

    return (
        <h4 className={`${styles.username} ${className}`}>
            {username}
            {withBadge && <Badge badgeName={userBadge} tooltip={badgeTooltip} tooltipDelay={650}/>}
            {children}
        </h4>
    )
}

export default memo(Username)