import { Component, memo, type ReactNode } from "react"
import styles from "./Page.module.css"
import UserTab from "@/Components/User/UserTab"

interface PageProps {
    className?: string,
    children?: ReactNode,
    customHeader?: ReactNode
}

const Page = (props: PageProps) => {
    const {
        className = "",
        children,
        customHeader
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
        </>
    )
}

export default memo(Page)