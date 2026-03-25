import Button from "@/components/Button"
import Placeholder from "@/components/Placeholder"
import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./BalanceSection.module.css"

const BalanceSection = (props) => {
    const {
        className
    } = props

    const {
        isLoaded,
        account
    } = useContext(AccountContext)

    return (
        <div className={`${styles["balance-section"]} ${className}`}>
            <p className={styles["balance-label"]}>Баланс: 
                {isLoaded === true ?
                    <span className={styles["balance-value"]}>{account.balance}</span> :
                    <Placeholder className={styles["balance-loader"]} />
                }
            </p>

            <Button className={styles["add-money-button"]}>
                <i className="fa-solid fa-wallet"></i>
            </Button>
        </div>
    )
}

export default BalanceSection