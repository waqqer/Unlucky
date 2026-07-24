import Balance from "@/Components/Info/Balance"
import Username from "@/Components/Info/Username"
import { memo } from "react"
import styles from "./UserInfo.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"

const UserInfo = (props: Classable) => {
    const {
        className = ""
    } = props
    
    return (
        <div className={`${styles.info} ${className}`}> 
            <Username withBadge badgeTooltip={false} withFire fireTooltip={false} badgeSize={24} />
            <Balance />
        </div>
    )
}

export default memo(UserInfo)