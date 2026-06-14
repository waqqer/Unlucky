import { memo } from "react"
import styles from "./Separator.module.css"

interface UISeparatorProps {
    className?: string,
    width?: number
}

const Separator = (props: UISeparatorProps) => {
    const {
        className = "",
        width = 90
    } = props

    return (
        <div className={`${styles.separator} ${className}`} style={{
            width: `${width}%`
        }}>

        </div>
    )
}

export default memo(Separator)