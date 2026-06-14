import { memo } from "react"
import LogoImg from "@/Shared/Assets/Images/logo.webp"
import type { Classable, Resizable } from "@/Shared/Types/PropsTypes"

const Logo = (props: Resizable & Classable) => {
    const {
        className = "",
        size = 512
    } = props
    return (
        <img
            src={LogoImg}
            alt="UnLucky logo"
            className={className}
            width={size}
        />
    )
}

export default memo(Logo)