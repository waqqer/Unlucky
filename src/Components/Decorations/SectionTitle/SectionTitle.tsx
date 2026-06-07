import { memo } from "react"
import styles from "./SectionTitle.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface SectionTitleProps extends Classable {
    animate?: boolean,
    className?: string,
    animSpeed?: number
    text: string
}

const SectionTitle = (props: SectionTitleProps) => {
    const {
        animate = true,
        className = "",
        animSpeed = 2,
        text
    } = props

    if (animate) {
        return (
            <h1
                className={`${styles.title} ${styles.animate} ${className}`}
                style={{
                    ["--speed" as any]: `${animSpeed}s`
                }}>
                {text.split(" ").map((v, i) => (
                    <span
                        key={i}
                        className={styles.el}
                        style={{
                            animationDelay: `0.${i + 2}s`
                        }}
                        onAnimationEnd={(ev) => {
                            ev.currentTarget.classList.add(styles["el-showed"])
                            ev.currentTarget.classList.remove(styles.el)
                        }}
                    >
                        {v}
                    </span>
                ))}
            </h1>
        )
    }

    return (
        <h1 className={`${styles.title} ${className}`}>
            {text}
        </h1>
    )
}

export default memo(SectionTitle)