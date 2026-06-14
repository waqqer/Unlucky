import { memo } from "react"
import LogoImg from "@/Shared/Assets/Images/logo.webp"
import type { Classable, Resizable } from "@/Shared/Types/PropsTypes"
import styles from "./Logo.module.css"

const Logo = (props: Resizable & Classable) => {
    const {
        className = "",
        size = 512
    } = props
    
    return (
        <img
            src={LogoImg}
            alt="UnLucky logo"
            className={`${styles.logo} ${className}`}
            width={size}
            loading="lazy"
            draggable={false}
        />
    )
}

export default memo(Logo)