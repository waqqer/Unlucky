import type { Classable } from "@/Shared/Types/PropsTypes"
import { memo } from "react"

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

    return (
        <div className={className}>
            <span>{userName}</span>
        </div>
    )
}

export default memo(Username)