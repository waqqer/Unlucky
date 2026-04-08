import { memo } from "react"
import styles from "./AdminInfoItem.module.css"

const AdminInfoItem = (props) => {
    const {
        className = "",
        children
    } = props

    return (
        <div className={`${styles["admin-item"]} ${className}`}>
            {children}
        </div>
    )
}

export default memo(AdminInfoItem)