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

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { data?: { message?: unknown } } }).response

        if (typeof response?.data?.message === "string") {
            return response.data.message
        }
    }

    return fallback
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
        if (!account || !spm) {
            return
        }

        setIsPending(true)

        try {
            const data = await PaymentApi.sendDeposit({
                amount: Number(value),
                uuid: account.UUID
            })

            spm.openPayment(data.code)
        } catch (error) {
            toast.error(getErrorMessage(error, "Ошибка при пополнение средств"))
        } finally {
            setIsPending(false)
        }

        onDeposit?.()
    }, [account, onDeposit, spm, value])

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
                ]} className={styles.presets} balanceDependent={false} />

                <Button
                    className={styles.btn}
                    isDisabled={isPending || account === null || spm === null}
                    onClick={handleDeposit}
                >
                    {isPending ? "Ожидание..." : "Пополнить"}
                </Button>
            </div>
        </div>
    )
}

export default memo(DepositModal)
