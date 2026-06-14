import { memo } from "react"
import type { UIBaseContainer } from "../ContainerTypes"
import styles from "./Section.module.css"

const Section = (props: UIBaseContainer) => {
    const {
        id = "",
        className = "",
        children,
        justify = "center",
        align = "center"
    } = props

    return (
        <section
            className={`${styles.section} ${className}`} 
            id={id}
            style={{
                justifyContent: justify,
                alignItems: align
            }}
        >
            {children}
        </section>
    )
}

export default memo(Section)