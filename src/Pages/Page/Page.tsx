import { memo, type ReactNode } from "react"
import styles from "./Page.module.css"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import UserTab from "@/widgets/UserNav/UserTab"

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
                    <UserTab />
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