import { memo } from "react"
import { Link } from "react-router"
import styles from "./UserTabButton.module.css"
import type { Classable, Clickable, Parent } from "@/Shared/Types/PropsTypes"

interface UserTabButtonProps extends Classable, Parent, Clickable {
    link?: string
}

const UserTabButton = (props: UserTabButtonProps) => {
    const {
        children,
        onClick,
        link = "",
        className = ""
    } = props

    return (
        <Link
            className={`${styles["tab-btn"]} ${className}`}
            onClick={onClick}
            to={link}
        >
            {children}
        </Link>
    )
}

export default memo(UserTabButton)