import { memo, type ReactNode } from "react"
import styles from "./Section.module.css"

interface SectionProps {
    className?: string,
    children?: ReactNode
}

const Section = (props: SectionProps) => {
    const {
        className = "",
        children
    } = props

    return (
        <section className={`${styles.section} ${className}`}>
            {children}
        </section>
    )
}

export default memo(Section)