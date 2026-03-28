import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState } from "react"

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

    return (
        <>
            <ModalExitButton modal={close} />

            <div>
                <div>
                    <Button onClick={addMode}>Пополнение</Button>
                    <Button onClick={takeMode}>Вывод</Button>
                </div>

                <div>
                    {mode === "ADD" ? 
                        <h1>Пополнение</h1> 
                        : 
                        <h1>Вывод</h1>
                    }
                </div>
            </div>
        </>
    )
}

export default PaymentModal