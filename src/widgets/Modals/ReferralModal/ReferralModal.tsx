import UserApi, { type ReferralInfo } from "@/Api/User"
import Button from "@/Components/Controlls/Buttons/Button"
import Separator from "@/Components/Decorations/Separator"
import { AccountContext } from "@/Context/AccountContext"
import { memo, useCallback, useContext, useEffect, useState } from "react"
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
    const { account } = useContext(AccountContext)
    const [info, setInfo] = useState<ReferralInfo | null>(null)
    const [code, setCode] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isPending, setIsPending] = useState<boolean>(false)

    const load = useCallback(async () => {
        if (!account) return

        setIsLoading(true)

        try {
            setInfo(await UserApi.getReferralInfo(account.UUID))
        } catch (error) {
            toast.error(getErrorMessage(error, "Не удалось загрузить реферальную систему"))
        } finally {
            setIsLoading(false)
        }
    }, [account])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void load()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [load])

    const handleCopy = useCallback(async () => {
        if (!info) return

        await navigator.clipboard.writeText(info.code)
        toast.success("Реферальный код скопирован")
    }, [info])

    const handleApply = useCallback(async () => {
        if (!account) return

        setIsPending(true)

        try {
            const data = await UserApi.applyReferralCode(account.UUID, code)
            setInfo(data)
            setCode("")
            toast.success("Реферальный код применен")
        } catch (error) {
            toast.error(getErrorMessage(error, "Не удалось применить реферальный код"))
        } finally {
            setIsPending(false)
        }
    }, [account, code])

    const percent = info ? Math.round(info.rewardPercent * 100) : 5

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
                    <h1 onClick={handleCopy}>{isLoading ? "Загрузка..." : info?.code ?? "CODE"}</h1>
                </div>

                <div className={styles.stats}>
                    <div>
                        <span>Подключено</span>
                        <strong>{formatNumber(info?.referralsCount ?? 0)}</strong>
                    </div>

                    <div>
                        <span>Заработано</span>
                        <strong>{formatNumber(info?.earnedAmount ?? 0)} Ар</strong>
                    </div>
                </div>
            </section>

            {info?.usedCode && (
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <div>
                            <h3>Код уже ввёден</h3>
                            <p>Использован код игрока: <b>{info.usedCode.ownerName}</b></p>
                        </div>
                    </div>
                </section>
            )}

            {info?.canApplyCode && (
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
