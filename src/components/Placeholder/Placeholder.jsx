import { memo } from "react"
import styles from "./Placeholder.module.css"

const Placeholder = (props) => {
    const {
        className
    } = props

    return (
        <span className={`${styles.loader} ${className}`}></span>
    )
}

export default memo(Placeholder)