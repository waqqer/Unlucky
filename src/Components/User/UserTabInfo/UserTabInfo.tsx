import { memo, useContext } from "react"
import styles from "./UserTabInfo.module.css"
import Username from "../Username"
import type { Classable } from "@/Shared/Types/PropsTypes"
import { AccountContext } from "@/Context/AccountContext"
import Head from "@/Components/Decorations/Head"

interface UserTabInfoProps extends Classable {
    size?: number
    usernameClass?: string
    balanceClass?: string
    avatarClass?: string
}

const UserTabInfo = (props: UserTabInfoProps) => {
    const {
        size = 48,
        className = "",
        usernameClass = "",
        balanceClass = "",
        avatarClass = ""
    } = props

    const { userInfo } = useContext(AccountContext)

    return (
        <div className={`${styles.about} ${className}`}>
            <div className={`${styles.avatar} ${avatarClass}`}>
                <Head size={size}/>
            </div>

            <div className={styles.info}>
                <Username className={`${styles.nickname} ${usernameClass}`} />

                <span className={`${styles.balance} ${balanceClass}`}>
                    {userInfo?.balance || 1234}
                </span>
            </div>
        </div>
    )
}

export default memo(UserTabInfo)