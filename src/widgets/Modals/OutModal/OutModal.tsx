import { memo, useCallback, useContext, useEffect, useState } from "react"
import styles from "./OutModal.module.css"
import Separator from "@/Components/Decorations/Separator"
import Input from "@/Components/Controlls/Inputs/Input"
import { AccountContext } from "@/Context/AccountContext"
import type { UserCard } from "@/Api/Payment"
import PaymentApi from "@/Api/Payment/Payment"
import Button from "@/Components/Controlls/Buttons/Button"
import { toast } from "react-toastify"

interface UIOutModalProps {
    onOut?: () => void
}

const OutModal = (props: UIOutModalProps) => {
    const {
        onOut
    } = props

    const { balance, account, setBalanceTo } = useContext(AccountContext)

    const [value, setValue] = useState<string>(String(balance) ?? "250")
    const [currentCard, setCurrentCard] = useState<string>("")
    const [cards, setCards] = useState<UserCard[]>([])

    const [isPending, setIsPending] = useState<boolean>(false)

    const handleSelectCard = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentCard(ev.target.value)
    }, [])

    const handleOut = useCallback(async () => {
        if (!account && !currentCard && currentCard === "")
            return

        setIsPending(true)

        try {
            const data = await PaymentApi.sendTransaction({
                amount: Number(value),
                uuid: account.UUID,
                card: currentCard
            })

            setBalanceTo(data.new_balance)

            toast.success(`Успешный вывод средств на ${value} Ар.`)
        } catch (er: any) {
            const message = er.response?.data?.message || "Ошибка при выводе средств"
            toast.error(message)
        } finally {
            setIsPending(false)
        }

        onOut?.()
    }, [account, currentCard, value, setBalanceTo])

    useEffect(() => {
        if (!account)
            return

        const getUserCards = async () => {
            const data = await PaymentApi.getCards(account.UUID)
            setCards(data)
        }
        getUserCards()
    }, [account])

    return (
        <div className={styles.content}>
            <h2>Вывод средств</h2>
            <Separator size={100} />

            <h4 className={styles.balance}>Баланс: <span>{balance} Ар</span></h4>

            <div className={styles.form}>
                <div className={styles["input-box"]}>
                    <p>Сумма вывода</p>
                    <Input
                        type="number"
                        value={value}
                        min={0}
                        max={1000}
                        onChange={v => setValue(v)}
                    />
                </div>

                <div className={styles["input-box"]}>
                    <p>Номер карты</p>
                    <select
                        className={styles.select}
                        name="card"
                        id="card"
                        onChange={handleSelectCard}
                        value={currentCard}
                    >
                        <option value="" className={styles.option}>Выберите карту...</option>
                        {cards.map((v, i) => (
                            <option className={styles.option} value={String(v.number)} key={i}>
                                <div className={styles.card} aria-hidden="true">💳</div>
                                <span>{v.name} ({v.number})</span>
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    className={styles.btn}
                    isDisabled={isPending || account === null}
                    onClick={handleOut}
                >
                    {isPending ? "Ожидание..." : "Вывести"}
                </Button>
            </div>
        </div>
    )
}

export default memo(OutModal)