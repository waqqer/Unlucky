import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState, useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./PaymentModal.module.css"
import { useNavigate } from "react-router"
import PaymentsApi from "@/api/payments"

const PaymentModal = (props) => {
    const {
        method = "ADD",
        close
    } = props

    const { account, user } = useContext(AccountContext)
    const [amount, setAmount] = useState(10)

    const handleAmountChange = useCallback((e) => {
        const value = e.target.value
        if (value >= 1 && value <= 1000) {
            setAmount(value)
        }
    }, [])

    const handlePayment = useCallback(() => {
        PaymentsApi.newAddPay(user.minecraftUUID, amount)
        .then(d => console.log(d))
    }, [amount])

    const isSubmitDisabled = !amount || amount < 1 || !user

    return (
        <>
            <ModalExitButton modal={close} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={`${styles["method-icon"]} ${method === "ADD" ? styles["method-add"] : styles["method-take"]}`}>
                        {method === "ADD" ? (
                            <i className="fa-solid fa-credit-card"></i>
                        ) : (
                            <i className="fa-solid fa-wallet"></i>
                        )}
                    </div>
                    <h2 className={styles.title}>
                        {method === "ADD" ? "Пополнение баланса" : "Вывод средств"}
                    </h2>
                </div>

                {account && (
                    <div className={styles["balance-info"]}>
                        <span className={styles["balance-label"]}>Доступно:</span>
                        <span className={styles["balance-value"]}>{account.balance ?? 0} Ар</span>
                    </div>
                )}

                <div className={styles.form}>
                    <div className={styles["input-wrapper"]}>
                        <input
                            className={styles.input}
                            type="number"
                            min={1}
                            max={1000}
                            placeholder=" "
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        <label className={styles["input-label"]}>
                            {method === "ADD" ? "Сумма пополнения" : "Сумма вывода"}
                        </label>
                        <span className={styles["input-hint"]}>от 1 до 1000 Ар</span>
                    </div>

                    <div className={styles["presets"]}>
                        {[100, 250, 500, 1000].map((preset) => (
                            <button
                                key={preset}
                                className={styles["preset-btn"]}
                                onClick={() => setAmount(preset)}
                            >
                                +{preset}
                            </button>
                        ))}
                    </div>

                    <Button
                        className={`${styles.btn} ${isSubmitDisabled ? styles["btn-disabled"] : ""}`}
                        disabled={isSubmitDisabled}
                        onClick={handlePayment}
                    >
                        {method === "ADD" ? "Пополнить" : "Вывести"}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default PaymentModal
