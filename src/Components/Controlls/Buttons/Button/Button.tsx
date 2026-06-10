import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useCallback, type MouseEvent, useRef } from "react"
import styles from "./Button.module.css"
import { ButtonStyle, type BaseButton } from "../types"

interface ButtonProps extends Classable, Identical, Parent, BaseButton {
    type?: ButtonStyle
}


const Button = (props: ButtonProps) => {
    const {
        onClick,
        className = "",
        id = "",
        onHoverStart,
        onHoverEnd,
        onHoverMove,
        children,
        type = ButtonStyle.PRIMARY,
        disabled = false
    } = props

    const shineRef = useRef<HTMLSpanElement>(null)

    const handleHoverStart = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
        if(onHoverStart) 
            onHoverStart(ev)

        if(shineRef.current) {
            const el = shineRef.current
            el.style.visibility = `visible`
        }
    }, [onHoverStart])

    const handleHoverEnd = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
        if(onHoverEnd) 
            onHoverEnd(ev)

        if(shineRef.current) {
            const el = shineRef.current
            el.style.visibility = `hidden`
        }
    }, [onHoverEnd])

    const handleHover = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
        if(onHoverMove) 
            onHoverMove(ev)

        if(shineRef.current) {
            const el = shineRef.current
            const rect = ev.currentTarget.getBoundingClientRect()
            const x = ev.clientX - rect.left
            const y = ev.clientY - rect.top
            el.style.top = `${y}px`
            el.style.left = `${x}px`
        }
    }, [onHoverMove])

    return (
        <button
            className={`${styles.btn} ${styles[type]} ${className}`}
            onClick={onClick}
            id={id}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onMouseMove={handleHover}
            disabled={disabled}
        >
            <span className={styles.shine} ref={shineRef}></span>
            {children}
        </button>
    )
}

export default memo(Button)