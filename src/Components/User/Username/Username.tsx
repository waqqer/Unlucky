import type { Classable } from "@/Shared/Types/PropsTypes"
import { memo } from "react"

interface UsernameProps extends Classable {
    className?: string
}
const Username = (props: UsernameProps) => {
    const {
        className = ""
    } = props

    return (
        <div className={className}>
            <span>Username</span>
        </div>
    )
}

export default memo(Username)