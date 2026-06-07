import { memo, type MouseEventHandler, type ReactNode } from "react"
import { Link } from "react-router"
import styles from "./UserTabButton.module.css"

interface UserTabButtonProps {
    children?: ReactNode,
    onClick?: MouseEventHandler
    link?: string,
    className?: string
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