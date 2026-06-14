import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext } from "react"
import styles from "./Balance.module.css"
import type { Wallet } from "@/Shared/Types/UserTypes"
import { AccountContext } from "@/Context/AccountContext"

interface UIBalanceProps extends Classable, Parent {
    data?: Wallet
}

const Balance = (props: UIBalanceProps) => {
    const {
        children,
        className = "",
        data
    } = props

    const { userInfo } = useContext(AccountContext)

    return (
        <p className={`${styles.balance} ${className}`}>
            {data ? data.balance : userInfo ? userInfo.balance : 1000}
            {children}
        </p>
    )
}

export default memo(Balance)