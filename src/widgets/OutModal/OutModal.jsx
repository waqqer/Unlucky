import ModalExitButton from "@/components/ModalExitButton"
import { useContext, useState, useCallback, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import Button from "@/components/Button"
import styles from "./OutModal.module.css"
import SPCard from "@/components/SPCard"
import UserApi from "@/api/users"
import PaymentApi from "@/api/payments"

const OutModal = (props) => {
    const {
        close
    } = props

    const { spm, user, account } = useContext(AccountContext)

    const [amount, setAmount] = useState(10)
    const [card, setCard] = useState(null)
    const [cardList, setCardList] = useState([])

    useEffect(() => {
        if (!user)
            return

        UserApi.getCards(user.minecraftUUID)
            .then(d => setCardList(d))
    }, [user])

    const handleAmountChange = useCallback((e) => {
        const value = e.target.value
        if (value >= 1 && value <= 1000) {
            setAmount(value)
        }
    }, [])

    const handleCardSelect = useCallback((c) => {
        setCard(c)
    }, [])

    const handleClick = useCallback(() => {
        if (card) {
            PaymentApi.transaction(card.number, user.minecraftUUID, amount)
                .then(d => {
                    if (d.succes) {
                        window.location.reload()
                    }
                })
        }
    }, [amount, card, user])

    const isSubmitDisabled = !amount || amount < 1 || !user || cardList.length === 0 || !card

    return (
        <>
            <ModalExitButton modal={close} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={`${styles["method-icon"]} ${styles["method-take"]} mobile-hide`}>
                        <i className="fa-solid fa-wallet"></i>
                    </div>
                    <h3 className={`${styles.title}`}>
                        Вывод средств
                    </h3>
                </div>

                <div className={styles["balance-info"]}>
                    <span className={styles["balance-label"]}>Доступно:</span>
                    <span className={styles["balance-value"]}>{account?.balance ?? 0} Ар</span>
                </div>

                <div className={styles.body}>
                    <div className={styles.inputBox}>
                        <h3 className="mobile-hide">Сумма вывода</h3>

                        <input
                            className={styles.input}
                            type="number"
                            min={1}
                            max={account?.balance ?? 1000}
                            placeholder=" "
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        <label className={styles["input-label"]}>
                            Сумма пополнения
                        </label>
                        <span className={`${styles["input-hint"]} mobile-hide`}>
                            от 1 до {account?.balance ?? 1000} Ар
                        </span>

                        <div className={`${styles["presets"]} mobile-hide`}>
                            {[50, 100, 250, 500, 1000].map((preset) => (
                                <button
                                    key={preset}
                                    className={styles["preset-btn"]}
                                    onClick={() => setAmount(preset)}
                                    disabled={preset > (account?.balance ?? 1000)}
                                >
                                    +{preset}
                                </button>
                            ))}
                        </div>

                        <Button
                            className={`${styles.btn} ${isSubmitDisabled ? styles["btn-disabled"] : ""}`}
                            disabled={isSubmitDisabled}
                            onClick={handleClick}
                        >
                            Вывести
                        </Button>
                    </div>

                    <div className={styles.cards}>
                        <h3>Выберите карту</h3>
                        <div className={styles.cardList}>
                            {cardList.length === 0 ? (
                                <p>У вас нету карт</p>
                            ) : (
                                cardList.map(c => (
                                    <SPCard
                                        key={c.number}
                                        name={c.name}
                                        code={c.number}
                                        selected={card?.number === c.number}
                                        onSelect={() => {
                                            if (c.number === card?.number) {
                                                handleCardSelect(null)
                                            } else {
                                                handleCardSelect(c)
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OutModal