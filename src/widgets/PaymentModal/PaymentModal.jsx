import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState } from "react"
import styles from "./PaymentModal.module.css"

const PaymentModal = (props) => {
    const {
        close
    } = props

    const [mode, setMode] = useState("ADD")

    const addMode = useCallback(() => {
        setMode("ADD")
    })

    const takeMode = useCallback(() => {
        setMode("TAKE")
    })

    let renderedBody = (
        <div className={styles.body}>
            <h3>Пополнение</h3>
            <input type="number" />
            <Button>Пополнить</Button>
        </div>
    )

    if(mode === "TAKE") {
        renderedBody = (
           <div>

           </div> 
        )
    }

    return (
        <>
            <ModalExitButton modal={close} />

            <div>
                <div>
                    {renderedBody}
                </div>

                <div className={styles["btn-container"]}>
                    <Button onClick={addMode} className={styles.btn}>Пополнение</Button>
                    <Button onClick={takeMode} className={styles.btn}>Вывод</Button>
                </div>
            </div>
        </>
    )
}

export default PaymentModal