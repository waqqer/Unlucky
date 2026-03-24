import Button from "@/components/Button"
import styles from "./BalanceSection.module.css"

const BalanceSection = (props) => {
    const {
        balance=0,
        className
    } = props

    return (
        <div className={`${styles["balance-section"]} ${className}`}>
            <p>Баланс: <span>{balance}</span></p>

            <Button className={styles["add-money-button"]}>
                <i className="fa-solid fa-wallet"></i>
            </Button>
        </div>
    )
}

export default BalanceSection