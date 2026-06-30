import { memo, useCallback, useContext, useState } from "react"
import styles from "./DepositModal.module.css"
import Separator from "@/Components/Decorations/Separator"
import Input from "@/Components/Controlls/Inputs/Input"
import Presets from "@/widgets/Games/Layout/Presets"
import Button from "@/Components/Controlls/Buttons/Button"
import { AccountContext } from "@/Context/AccountContext"
import PaymentApi from "@/Api/Payment/Payment"
import { AuthContext } from "@/Context/AuthContext"
import { toast } from "react-toastify"

interface UIDepositModalProps {
    onDeposit?: () => void
}

const DepositModal = (props: UIDepositModalProps) => {
    const {
        onDeposit
    } = props

    const { account, balance } = useContext(AccountContext)
    const { spm } = useContext(AuthContext)

    const [value, setValue] = useState<string>("250")
    const [isPending, setIsPending] = useState<boolean>(false)

    const changePresetHandle = useCallback((v: number) => {
        setValue(String(v))
    }, [])

    const handleDeposit = useCallback(async () => {
        setIsPending(true)

        try {
            const data = await PaymentApi.sendDeposit({
                amount: Number(value),
                uuid: account.UUID
            })

            spm.openPayment(data.code)
        } catch (er: any) {
            const message = er.response?.data?.message || "Ошибка при пополнение средств"
            toast.error(message)
        } finally {
            setIsPending(false)
        }

        onDeposit?.()
    }, [account, spm, value])

    return (
        <div className={styles.content}>
            <h2>Пополнение баланса</h2>
            <Separator size={100} />

            <h4 className={styles.balance}>Баланс: <span>{balance} Ар</span></h4>

            <div className={styles.form}>
                <p className={`${styles.title} hide--mobile`}>Сумма пополнения</p>
                <Input
                    type={"number"}
                    value={value}
                    onChange={(v) => setValue(v)}
                    min={0}
                    max={1000}
                />
                <Presets onClick={changePresetHandle} sets={[
                    10, 25, 50, 75, 100, 250, 500, 1000
                ]} className={styles.presets} />

                <Button
                    className={styles.btn}
                    isDisabled={isPending || account === null}
                    onClick={handleDeposit}
                >
                    {isPending ? "Ожидание..." : "Пополнить"}
                </Button>
            </div>
        </div>
    )
}

export default memo(DepositModal)