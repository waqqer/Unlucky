import { memo, useCallback, useEffect, useRef } from "react"
import styles from "./Button.module.css"

const Button = (props) => {
    const {
        className,
        onClick,
        type = "button",
        isDisabled = false,
        activateOnSpace = false,
        children
    } = props

    const buttonRef = useRef(null)

    const handleKeyDown = useCallback((e) => {
        if (!activateOnSpace || isDisabled) return
        if (e.code === "Space" || e.key === " ") {
            e.preventDefault()
            onClick?.(e)
        }
    }, [activateOnSpace, isDisabled, onClick])

    useEffect(() => {
        if (!activateOnSpace) return

        const handleGlobalKeyDown = (e) => {
            if (!activateOnSpace || isDisabled) return
            if (e.code === "Space" || e.key === " ") {
                const activeElement = document.activeElement
                if (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.isContentEditable) {
                    return
                }
                e.preventDefault()
                onClick?.(e)
            }
        }

        document.addEventListener("keydown", handleGlobalKeyDown)
        return () => document.removeEventListener("keydown", handleGlobalKeyDown)
    }, [activateOnSpace, isDisabled, onClick])

    return (
        <button
            ref={buttonRef}
            className={`${styles.button} ${className}`}
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
        >
            {children}
        </button>
    )
}

export default memo(Button)