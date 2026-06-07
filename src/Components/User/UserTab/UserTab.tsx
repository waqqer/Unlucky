import { memo } from "react"
import styles from "./UserTab.module.css"
import UserTabInfo from "../UserTabInfo"
import UserTabControlls from "../UserTabControlls"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface UserTabProps extends Classable {
    className?: string
}
const UserTab = (props: UserTabProps) => {
    const {
        className = ""
    } = props

    return (
        <nav className={`${styles.tab} ${className}`}>
            <UserTabInfo />
            <UserTabControlls className={styles.controlls}/>
        </nav>
    )
}

export default memo(UserTab)