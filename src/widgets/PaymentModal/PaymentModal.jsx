import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { memo, useCallback, useState, useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./PaymentModal.module.css"
import PaymentApi from "@/api/payments"

const PaymentModal = (props) => {
    const {
        close,
        onPayment
    } = props

    const { account, user, spm } = useContext(AccountContext)
    const [amount, setAmount] = useState(10)

    const handleAmountChange = useCallback((e) => {
        const value = e.target.value
        if (value >= 0 && value <= 1000) {
            setAmount(value)
        }
    }, [])

    const handlePayment = useCallback(() => {
        PaymentApi.new(amount, user.minecraftUUID).then(d => {
            spm.openPayment(d.code)
            onPayment()
        })
    }, [amount, user, spm])

    const isSubmitDisabled = !amount || amount < 1 || !user

    return (
        <>
            <ModalExitButton modal={close} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={`${styles["method-icon"]} ${styles["method-add"]} mobile-hide`}>
                            <i className="fa-solid fa-credit-card"></i>
                    </div>
                    <h2 className={styles.title}>
                        Пополнение баланса
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
                            Сумма пополнения
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
                        Пополнить
                    </Button>
                </div>
            </div>
        </>
    )
}

export default memo(PaymentModal)
