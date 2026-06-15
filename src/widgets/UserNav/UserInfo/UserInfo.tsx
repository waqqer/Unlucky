import Balance from "@/Components/Info/Balance"
import Username from "@/Components/Info/Username"
import { memo } from "react"
import styles from "./UserInfo.module.css"

const UserInfo = () => {
    return (
        <div className={styles.info}> 
            <Username withBadge />
            <Balance />
        </div>
    )
}

export default memo(UserInfo)