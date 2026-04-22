import Button from "@/components/Button"
import Modal from 'react-modal'
import Placeholder from "@/components/Placeholder"
import { useCallback, useContext, useState } from "react"
import { AccountContext } from "@/context/AccountContext"
import PaymentModal from "../PaymentModal"
import styles from "./BalanceSection.module.css"
import OutModal from "../OutModal"

const BalanceSection = (props) => {
    const {
        className = ""
    } = props

    const {
        isLoaded,
        account,
        refreshAccount
    } = useContext(AccountContext)

    const [paymentModal, setPaymentModal] = useState(false)
    const [outModal, setOutModal] = useState(false)

    const сlosePayment = useCallback(() => setPaymentModal(false))
    const openPayment = useCallback(() => {
        if (isLoaded) {
            setPaymentModal(true)
        }
    }, [isLoaded])

    const closeOut = useCallback(() => setOutModal(false))
    const openOut = useCallback(() => {
        if(true) {
            setOutModal(true)
        }
    }, [isLoaded])

    const onPayment = useCallback(() => {
        setOutModal(false)
        setPaymentModal(false)
        refreshAccount()
    }, [])

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
                    <Button className={`${styles["add-money-button"]} ${styles["f-part"]}`} onClick={openOut}>
                        <i className="fa-solid fa-upload"></i>
                        <p>Вывод</p>
                    </Button>

                    <Button className={`${styles["add-money-button"]} ${styles["s-part"]}`} onClick={openPayment}>
                        <i className="fa-solid fa-download"></i>
                        <p>Пополнение</p>
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={paymentModal}
                onRequestClose={сlosePayment}
                contentLabel="Пополнение"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <PaymentModal close={сlosePayment} onPayment={onPayment} />
            </Modal>

            <Modal
                isOpen={outModal}
                onRequestClose={closeOut}
                contentLabel="Вывод"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <OutModal close={closeOut} onPayment={onPayment} />
            </Modal>
        </>
    )
}

export default BalanceSection