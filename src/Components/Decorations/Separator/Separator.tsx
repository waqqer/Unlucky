import { memo } from "react"
import styles from "./Separator.module.css"

interface UISeparatorProps {
    className?: string
}

const Separator = (props: UISeparatorProps) => {
    const {
        className = ""
    } = props

    return (
        <div className={`${styles.separator} ${className}`}>

        </div>
    )
}

export default memo(Separator)