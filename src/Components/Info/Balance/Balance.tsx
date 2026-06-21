import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import { memo, useContext } from "react"
import styles from "./Balance.module.css"
import type { Wallet } from "@/Shared/Types/UserTypes"
import { AccountContext } from "@/Context/AccountContext"

interface UIBalanceProps extends Classable, Parent {
    data?: Wallet,
    text?: boolean
}

const Balance = (props: UIBalanceProps) => {
    const {
        children,
        className = "",
        data,
        text = false
    } = props

    const { balance } = useContext(AccountContext)

    return (
        <p className={`${styles.balance} ${className}`}>
            {text && "Баланс: " }
            {data ? data.balance : balance}
            {children}
        </p>
    )
}

export default memo(Balance)