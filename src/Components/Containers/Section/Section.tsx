import { memo, type ReactNode } from "react"
import styles from "./Section.module.css"
import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes"

interface SectionProps extends Classable, Parent, Identical {
    className?: string,
    children?: ReactNode,
    id?: string
}

const Section = (props: SectionProps) => {
    const {
        className = "",
        children,
        id = ""
    } = props

    return (
        <section id={id} className={`${styles.section} ${className}`}>
            {children}
        </section>
    )
}

export default memo(Section)