import { memo } from "react"
import styles from "./Separator.module.css"
import type { Classable, Resizable } from "@/Shared/Types/PropsTypes"

interface UISeparatorProps extends Classable, Resizable {
    vertical?: boolean
}

const Separator = (props: UISeparatorProps) => {
    const {
        className = "",
        size = 90,
        vertical = false
    } = props

    if (vertical) {
        return (
            <div className={`${styles.separator} ${styles.vertical} ${className}`} style={{
                height: `${size}%`
            }}>
            </div>
        )
    }

    return (
        <div className={`${styles.separator} ${className}`} style={{
            width: `${size}%`
        }}>

        </div>
    )
}

export default memo(Separator)