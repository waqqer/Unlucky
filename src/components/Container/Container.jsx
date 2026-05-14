import { memo } from "react"
import styles from "./Container.module.css"

const Container = (props) => {
    const {
        className = "",
        children
    } = props

    return (
        <div className={`${styles.container} ${className}`} >
            <div className={className} >
                {children}
            </div>
        </div>
    )
}

export default memo(Container)