import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState } from "react"
import styles from "./PaymentModal.module.css"

const PaymentModal = (props) => {
    const {
        method = "ADD",
        close
    } = props

    return (
        <>
            <ModalExitButton modal={close} />

            {method === "ADD" ? 
            (
                <div className={styles.form}>
                    <h2>Пополнение</h2>

                    <input className={styles.input} type="number" min={1} max={1000} placeholder={"Сумма пополнения"}/>

                    <Button className={styles.btn}>Пополнить</Button>
                </div>
            )
            : 
            (
                <div className={styles.form}>
                    <h2>Вывод</h2>

                    <input className={styles.input} type="number" min={1} max={1000} placeholder={"Сумма вывода"}/>

                    <Button className={styles.btn}>Вывести</Button>
                </div>
            )
            }
        </>
    )
}

export default PaymentModal