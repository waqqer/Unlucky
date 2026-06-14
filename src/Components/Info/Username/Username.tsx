import type { BaseUser } from "@/Api/User"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext, useEffect, useState } from "react"
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

    const { user: DefaultUser } = useContext(AuthContext)
    const [username, setUsername] = useState<string>("Username")
    
    useEffect(() => {
        if(User) {
            setUsername(User.name)
            return
        } else if (DefaultUser) {
            setUsername(DefaultUser.username)
        }
    }, [DefaultUser, User])

    return (
        <h4 className={`${styles.username} ${className}`}>
            {username}
            {children}
        </h4>
    )
}

export default memo(Username)