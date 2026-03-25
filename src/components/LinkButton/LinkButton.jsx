import { Link } from "react-router"
import { memo } from "react"
import styles from "./LinkButton.module.css"

const LinkButton = (props) => {
    const {
        className,
        onClick,
        to = "/",
        children,
        target
    } = props

    return (
        <Link 
            className={`${styles["link-button"]} ${className}`} 
            onClick={onClick}
            to={to}
            target={target}
        > 
            {children} 
        </Link>
    )
}

export default memo(LinkButton)