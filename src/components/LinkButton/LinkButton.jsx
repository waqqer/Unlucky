import { Link } from "react-router"
import { memo } from "react"
import styles from "./LinkButton.module.css"

const LinkButton = (props) => {
    const {
        className = "",
        onClick,
        to = "/",
        external = false,
        children
    } = props

    return (
        <>
            {external === false ?
                <>
                    <Link
                        className={`${styles["link-button"]} ${className}`}
                        onClick={onClick}
                        to={to}
                    >
                        {children}
                    </Link>
                </>
                :
                <>
                    <a
                        className={`${styles["link-button"]} ${className}`}
                        onClick={onClick}
                        href={to}
                        target="_blank"
                    >
                        {children}
                    </a>
                </>
            }
        </>
    )
}

export default memo(LinkButton)