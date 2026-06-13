import { memo, type ReactNode } from "react"
import styles from "./Page.module.css"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"

interface PageProps extends Classable, Parent {
    className?: string,
    children?: ReactNode,
    customHeader?: ReactNode,
    customFooter?: ReactNode
}

const Page = (props: PageProps) => {
    const {
        className = "",
        children,
        customHeader,
        customFooter
    } = props

    return (
        <>
            <header>
                {customHeader ?
                    customHeader
                    :
                    <></>
                }
            </header>

            <main className={`${styles.page} ${className}`}>
                {children}
            </main>

            <footer>
                {customFooter &&
                    customFooter
                }
            </footer>
        </>
    )
}

export default memo(Page)