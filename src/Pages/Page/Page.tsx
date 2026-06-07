import { memo, type ReactNode } from "react"
import styles from "./Page.module.css"

interface PageProps {
    className?: string,
    children?: ReactNode
}

const Page = (props: PageProps) => {
    const {
        className = "",
        children
    } = props

    return (
        <>
            <header>

            </header>

            <main className={`${styles.page} ${className}`}>
                {children}
            </main>
        </>
    )
}

export default memo(Page)