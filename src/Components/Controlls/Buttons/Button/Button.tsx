import { memo, useCallback } from "react"
import type { UIBaseButton } from "../ButtonTypes"
import styles from "./Button.module.css"

const Button = (props: UIBaseButton) => {
    const {
        className = "",
        type = "DEFAULT",
        children,
        onClick
    } = props

    const handleClick = useCallback(() => {
        if (onClick)
            onClick()
    }, [onClick])

    return (
        <button
            onClick={handleClick}
            className={`${styles.btn} ${styles[type]} ${className}`}
        >
            {children}
        </button>
    )
}

export default memo(Button)