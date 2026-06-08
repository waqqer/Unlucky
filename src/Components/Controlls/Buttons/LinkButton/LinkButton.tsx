import { memo } from "react"
import type { BaseLinkButton } from "../types"
import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes"
import { Link } from "react-router"
import styles from "./LinkButton.module.css"

interface LinkButtonProps extends BaseLinkButton, Classable, Identical, Parent {}

const LinkButton = (props: LinkButtonProps) => {
    const {
        to,
        children,
        onHoverStart,
        onHoverEnd,
        onHoverMove,
        onClick,
        className = "",
        id = ""
    } = props

    return (
        <Link
            to={to}
            id={id}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onMouseMove={onHoverMove}
            onClick={onClick}
            className={`${styles.btn} ${className}`}
        >
            {children}
        </Link>
    )
}

export default memo(LinkButton)