import type { Classable } from "@/Shared/Types/PropsTypes"
import { memo, useMemo } from "react"
import styles from "./SectionTitle.module.css"

interface UISectionTitleProps extends Classable {
    text: string,
    animate?: boolean
}

const SectionTitle = (props: UISectionTitleProps) => {
    const {
        text,
        className = "",
        animate = false
    } = props

    const tiles: string[] = useMemo(() =>
        text.split(" "),
        [text])

    if (animate) {

        return (
            <h1
                className={`${styles.title} ${className}`}
            >
                {tiles.map((v, i) => (
                    <span key={i} style={{
                        animationDelay: `${(i + 0.1) / 6}s`
                    }}
                        onAnimationEnd={(ev) => {
                            ev.currentTarget.style.opacity = "1"
                        }}
                    >
                        {v}
                    </span>
                ))}
            </h1>
        )
    }

    return (
        <h1
            className={`${styles.title} ${className}`}
        >
            {text}
        </h1>
    )
}

export default memo(SectionTitle)