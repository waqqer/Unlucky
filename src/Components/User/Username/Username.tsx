import { AccountContext } from "@/Context/AccountContext"
import type { Classable } from "@/Shared/Types/PropsTypes"
import { memo, useContext } from "react"

interface UsernameProps extends Classable {
    className?: string,
    withBadge?: boolean,
    withFire?: boolean,
    userName?: string
}
const Username = (props: UsernameProps) => {
    const {
        className = "",
        userName
    } = props

    const { user } = useContext(AccountContext)

    return (
        <div className={className}>
            <span>{userName || user?.username || "Username"}</span>
        </div>
    )
}

export default memo(Username)