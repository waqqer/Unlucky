import { memo } from "react"
import styles from "./Placeholder.module.css"

const delay = {
    min: 0.1,
    max: 1
}

const duration = {
    min: 3,
    max: 10
}

const getLoaderStyle = (data) => {
    const del = Math.random() * (delay.max - delay.min) + delay.min;
    const dur = Math.random() * (duration.max - duration.min) + duration.min;
    return {
        animationDelay: `${del}s`,
        animationDuration: `${dur}s`,
        
        ...data
    }
}

const Placeholder = (props) => {
    const {
        className = ""
    } = props

    return (
        <div className={styles["loader-box"]}>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle({borderTopLeftRadius: "7px"})}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle()}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle()}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle({borderTopRightRadius: "7px"})}></span>

            <span className={`${styles.loader} ${className}`} style={getLoaderStyle({borderBottomLeftRadius: "7px"})}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle()}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle()}></span>
            <span className={`${styles.loader} ${className}`} style={getLoaderStyle({borderBottomRightRadius: "7px"})}></span>
        </div>
    )
}

export default memo(Placeholder)