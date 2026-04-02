import Button from "@/components/Button"
import Modal from 'react-modal'
import Placeholder from "@/components/Placeholder"
import { useCallback, useContext, useState } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./BalanceSection.module.css"
import PaymentModal from "../PaymentModal"

const BalanceSection = (props) => {
    const {
        className
    } = props

    const {
        isLoaded,
        account
    } = useContext(AccountContext)

    const [method, setMethod] = useState("ADD")
    const [paymentModal, setPaymentModal] = useState(false)

    const сlosePayment = useCallback(() => setPaymentModal(false))
    const openPaymentADD = useCallback(() => {
        setMethod("ADD")
        setPaymentModal(true)
    })
    const openPaymentTAKE = useCallback(() => {
        setMethod("TAKE")
        setPaymentModal(true)
    })

    return (
        <>
            <div className={`${styles["balance-section"]} ${className}`}>
                <p className={styles["balance-label"]}>Баланс:
                    {isLoaded === true ?
                        <span className={styles["balance-value"]}>{account.balance}</span> :
                        <Placeholder className={styles["balance-loader"]} />
                    }
                </p>

                <div className={`${styles.controlls}`}>
                    <Button className={`${styles["add-money-button"]} ${styles["f-part"]}`} onClick={openPaymentTAKE}>
                        <i className="fa-solid fa-wallet"></i>
                        <p>Вывод</p>
                    </Button>

                    <Button className={`${styles["add-money-button"]} ${styles["s-part"]}`} onClick={openPaymentADD}>
                        <i className="fa-solid fa-credit-card"></i>
                        <p>Пополнение</p>
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={paymentModal}
                onRequestClose={сlosePayment}
                contentLabel="Пополнение или вывод"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <PaymentModal method={method} close={сlosePayment} />
            </Modal>
        </>
    )
}

export default BalanceSection