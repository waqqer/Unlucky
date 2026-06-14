import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton";
import type { Classable, Clickable, Linked, Parent } from "@/Shared/Types/PropsTypes"
import { memo } from "react"
import styles from "./NavButton.module.css"

interface UINavButtonProps extends Parent, Classable, Clickable, Linked {

}

const NavButton = (props: UINavButtonProps) => {
    const {
        to,
        className = "",
        children,
        onClick
    } = props
    return (
        <LinkedButton
            to={to}
            onClick={onClick}
            className={`${styles["nav-btn"]} ${className}`}
            icon={false}
            type="TEXT"
        >
            {children}
        </LinkedButton>
    )
}

export default memo(NavButton)