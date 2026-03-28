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

    const [paymentModal, setPaymentModal] = useState(false)

    const сlosePayment = useCallback(() => setPaymentModal(false))
    const openPayment = useCallback(() => setPaymentModal(true))

    return (
        <>
            <div className={`${styles["balance-section"]} ${className}`}>
                <p className={styles["balance-label"]}>Баланс:
                    {isLoaded === true ?
                        <span className={styles["balance-value"]}>{account.balance}</span> :
                        <Placeholder className={styles["balance-loader"]} />
                    }
                </p>

                <Button className={styles["add-money-button"]} onClick={openPayment}>
                    <i className="fa-solid fa-wallet"></i>
                </Button>
            </div>

            <Modal
                isOpen={paymentModal}
                onRequestClose={сlosePayment}
                contentLabel="Пополнение или вывод"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <PaymentModal close={сlosePayment} />
            </Modal>
        </>
    )
}

export default BalanceSection