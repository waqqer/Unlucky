import { memo } from "react"
import { LogoImg } from "@/Shared/Assets/Images"
import styles from "./Logo.module.css"

interface LogoProps {
    className?: string,
    width?: number,
    height?: number
}

const Logo = (props: LogoProps) => {
    const {
        className = "",
        width = 128,
        height
    } = props

    return (
        <div className={`${styles.logoContainer} ${className}`}>
            <img 
                src={LogoImg}
                alt="UnLucky Logo"
                className={styles.logoImg}
                loading="lazy"
                width={width}
                height={height}
                draggable={false}
            />
        </div>
    )
}

export default memo(Logo)