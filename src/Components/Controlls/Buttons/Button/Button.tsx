import { memo, useCallback } from "react"
import type { UIBaseButton } from "../ButtonTypes"
import styles from "./Button.module.css"
import hoverSound from "@/Shared/Assets/Audio/hover.mp3"
import useSound from "@/Hooks/useSound"

const Button = (props: UIBaseButton) => {
    const {
        className = "",
        type = "DEFAULT",
        children,
        onClick,
        id = "",
        sound = false,
        isDisabled = false
    } = props

    const hover = useSound(hoverSound, {
        volume: 0.005
    })

    const handleClick = useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault()
        
        if (onClick)
            onClick()
    }, [onClick])

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => {
                if (sound) {
                    hover.play()
                }
            }}
            className={`${styles.btn} ${styles[type]} ${className}`}
            id={id}
            disabled={isDisabled}
        >
            {children}
        </button>
    )
}

export default memo(Button)