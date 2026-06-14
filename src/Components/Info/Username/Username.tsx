import type { BaseUser } from "@/Api/User"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext } from "react"
import styles from "./Username.module.css"
import { AuthContext } from "@/Context/AuthContext"

interface UIUsernameProps extends Classable, Parent {
    User?: BaseUser,
    withBadge?: boolean,
    withFire?: boolean
}

const Username = (props: UIUsernameProps) => {
    const {
        className = "",
        children,
        User,
        withBadge = false,
        withFire = false
    } = props

    const { user } = useContext(AuthContext)

    return (
        <h4 className={`${styles.username} ${className}`}>
            {User ? User.name : user ? user.username : "Username"}
            {children}
        </h4>
    )
}

export default memo(Username)