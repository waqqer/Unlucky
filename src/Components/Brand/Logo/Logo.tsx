import { memo } from "react"
import { LogoImg } from "@/Shared/Assets/Images"
import styles from "./Logo.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface LogoProps extends Classable {
    className?: string,
    width?: number,
    height?: number,
    background?: boolean
}

const Logo = (props: LogoProps) => {
    const {
        className = "",
        width = 128,
        height,
        background = false
    } = props

    return (
        <div className={`${styles.logoContainer} ${className}`} style={{
            ["--grid" as any]: background ? "block" : "none"
        }}>
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