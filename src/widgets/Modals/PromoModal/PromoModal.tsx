import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import styles from "./PromoModal.module.css"
import Separator from "@/Components/Decorations/Separator"
import Input from "@/Components/Controlls/Inputs/Input"
import PromoApi from "@/Api/Promo"
import { AccountContext } from "@/Context/AccountContext"
import KeybindedButton from "@/Components/Controlls/Buttons/KeybindedButton"
import { toast } from "react-toastify"
import { BadgesConfig } from "@/Shared/Configs"
import { MessengerContext } from "@/Context/MessengerContext"

interface UIPromoModalProps {
    onPromoActivate?: () => void
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

const PromoModal = (props: UIPromoModalProps) => {
    const {
        onPromoActivate
    } = props

    const [pending, setPending] = useState<boolean>(false)
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [messageType, setMessageType] = useState<"error" | "success">("success")

    const { account, incrementBalance, addBadge } = useContext(AccountContext)
    const { setBadgeMessage } = useContext(MessengerContext)

    const inputRef = useRef<HTMLInputElement>(null)
    const messageRef = useRef<HTMLParagraphElement>(null)
    const timerRef = useRef<number>(null)

    const handleSumbit = useCallback(async () => {
        if (!account) {
            setShowMessage(true)
            setMessage("Не авторизован!")
            setMessageType("error")
            return
        }

        if (!inputRef.current)
            return

        const value = inputRef.current.value

        if (value === "") {
            setShowMessage(true)
            setMessage("Введите промокод!")
            setMessageType("error")
            return
        }

        setPending(true)

        try {
            const data = await PromoApi.activatePromocode(value)
            const rewards = data.rewards
            const badgeId = rewards?.badgeAdded
            const badge = badgeId ? BadgesConfig.badges[badgeId] : undefined

            setMessageType(data.success ? "success" : "error")
            setMessage(data.message)
            setShowMessage(true)

            incrementBalance(rewards?.balanceAdded || 0)

            if(badgeId) {
                setBadgeMessage(badgeId)
                addBadge(badgeId)
            }

            toast((
                <div className={styles.toast}>
                    <h4 className={styles["toast-title"]}>Промокод "{value.toUpperCase()}" активирован!</h4>
                    {rewards && (
                        <>
                            <p>Получено:</p>
                            <ul className={styles["toast-list"]}>
                                {rewards.balanceAdded && <li>+ {rewards.balanceAdded} Ар</li>}
                                {badge && <li style={{
                                    color: `${BadgesConfig.colors[badge.quality]}`
                                }}>+ '{badge.title}'</li>}
                            </ul>
                        </>
                    )}
                </div>
            ), { autoClose: 5000 })

            if (data.success) {
                inputRef.current.value = ""
            }

            if(onPromoActivate) {
                onPromoActivate()
            }
        } catch (error) {
            setMessageType("error")
            const message = getErrorMessage(error, "Ошибка при активации промокода")
            setMessage(message)
            setShowMessage(true)
        } finally {
            setPending(false)
        }
    }, [account, addBadge, incrementBalance, onPromoActivate, setBadgeMessage])

    useEffect(() => {
        const element = messageRef.current
        if (!element) return

        element.classList.remove(styles["mes-anim"])

        if (showMessage && message !== "") {
            void element.offsetWidth

            element.classList.add(styles["mes-anim"])

            timerRef.current = setTimeout(() => {
                element.classList.remove(styles["mes-anim"])
                setShowMessage(false)
            }, 3000)
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [showMessage, message])

    return (
        <div className={styles.content}>
            <h2>Промокоды</h2>
            <Separator size={100} />

            <form className={styles.form}>
                <div className={styles["input-box"]}>
                    <Input
                        type="text"
                        title="Введите промокод"
                        className={styles.input}
                        id="promo"
                        name="promo"
                        ref={inputRef}
                    />
                    <p className={`${styles.message} ${styles[messageType]}`} ref={messageRef} style={{
                        opacity: showMessage ? 1 : 0
                    }}>{message}</p>
                </div>

                <KeybindedButton
                    bind="Enter"
                    className={styles.btn}
                    onClick={handleSumbit}
                    isDisabled={pending}
                >{pending ? "Ожидание" : "Использовать"}</KeybindedButton>
            </form>
        </div>
    )
}

export default memo(PromoModal)
