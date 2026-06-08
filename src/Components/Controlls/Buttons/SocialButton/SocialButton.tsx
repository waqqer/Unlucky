import { memo, type ReactNode } from "react"
import LinkButton from "../LinkButton"
import type { BaseLinkButton } from "../types"
import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes"
import styles from "./SocialButton.module.css"

interface SocialButtonProps extends BaseLinkButton, Parent, Identical, Classable {
    icon: ReactNode,
    name: string
}

const SocialButton = (props: SocialButtonProps) => {
    const {
        children,
        icon,
        id = "",
        className = "",
        onHoverStart,
        onHoverEnd,
        onHoverMove,
        onClick,
        to,
        name
    } = props

    return (
        <LinkButton
            id={id}
            className={`${styles.btn} ${styles[name.toLowerCase()]} ${className}`}
            to={to}
            onClick={onClick}
            onHoverEnd={onHoverEnd}
            onHoverMove={onHoverMove}
            onHoverStart={onHoverStart}
        >
            {icon}
            {children}
        </LinkButton>
    )
}

export default memo(SocialButton)