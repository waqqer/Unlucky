import UserApi from "@/Api/User"
import Button from "@/Components/Controlls/Buttons/Button"
import Separator from "@/Components/Decorations/Separator"
import { AccountContext } from "@/Context/AccountContext"
import { memo, useCallback, useContext, useState } from "react"
import { toast } from "react-toastify"
import styles from "./ReferralModal.module.css"

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { data?: { message?: unknown } } }).response

        if (typeof response?.data?.message === "string") {
            return response.data.message
        }
    }

    return fallback
}

const formatNumber = (value: number) => new Intl.NumberFormat("ru-RU").format(value)

const ReferralModal = () => {
    const {
        account,
        referralInfo,
        setReferralInfo,
        disableReferralCodeApply
    } = useContext(AccountContext)
    const [code, setCode] = useState<string>("")
    const [isPending, setIsPending] = useState<boolean>(false)

    const handleApply = useCallback(async () => {
        if (!account) return

        setIsPending(true)

        try {
            const data = await UserApi.applyReferralCode(account.UUID, code)
            setReferralInfo({
                ...data,
                canApplyCode: false
            })
            disableReferralCodeApply()
            setCode("")
            toast.success("Реферальный код применен")
        } catch (error) {
            toast.error(getErrorMessage(error, "Не удалось применить реферальный код"))
        } finally {
            setIsPending(false)
        }
    }, [account, code, disableReferralCodeApply, setReferralInfo])

    const percent = referralInfo ? Math.round(referralInfo.rewardPercent * 100) : 5

    return (
        <div className={styles.content}>
            <h2>Реферальная система</h2>
            <Separator size={100} />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <div>
                        <h3>Твой код</h3>
                        <p>Приглашай игроков и получай {percent}% с каждого их проигрыша.</p>
                    </div>
                </div>

                <div className={styles.codeBox}>
                    <h1 >{referralInfo?.code ?? "CODE"}</h1>
                </div>

                <div className={styles.stats}>
                    <div>
                        <span>Подключено</span>
                        <strong>{formatNumber(referralInfo?.referralsCount ?? 0)}</strong>
                    </div>

                    <div>
                        <span>Заработано</span>
                        <strong>{formatNumber(referralInfo?.earnedAmount ?? 0)} Ар</strong>
                    </div>
                </div>
            </section>

            {referralInfo?.usedCode && (
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <div>
                            <h3>Код уже ввёден</h3>
                            <p>Использован код игрока: <b>{referralInfo.usedCode.ownerName}</b></p>
                        </div>
                    </div>
                </section>
            )}

            {referralInfo?.canApplyCode && (
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <div>
                            <h3>Ввести код</h3>
                            <p>Код можно ввести только один раз и только до первой игры.</p>
                        </div>
                    </div>

                    <div className={styles.applyForm}>
                        <input
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="ULXXXXXXXX"
                            maxLength={16}
                        />
                        <Button className={styles.applyBtn} onClick={handleApply} isDisabled={isPending || code.trim() === ""}>
                            {isPending ? "Проверка..." : "Применить"}
                        </Button>
                    </div>
                </section>
            )}
        </div>
    )
}

export default memo(ReferralModal)
