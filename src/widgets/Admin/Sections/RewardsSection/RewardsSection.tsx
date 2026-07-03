import AdminApi, { type AdminStreakReward, type AdminStreakRewardPayload } from "@/Api/Admin"
import Button from "@/Components/Controlls/Buttons/Button"
import { BadgesConfig } from "@/Shared/Configs"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./RewardsSection.module.css"

type RewardDraft = Omit<AdminStreakReward, "balance" | "day"> & {
    balance: number | ""
    day: number | ""
    isNew?: boolean
}

const badgeOptions = Object.entries(BadgesConfig.badges)

const createEmptyReward = (id: number): RewardDraft => ({
    id,
    day: 1,
    title: "",
    description: "",
    balance: 0,
    badge: "",
    isActive: true,
    isNew: true
})

const normalizeReward = (reward: RewardDraft): AdminStreakRewardPayload => ({
    day: Number(reward.day) || 1,
    title: reward.title,
    description: reward.description,
    balance: Number(reward.balance) || 0,
    badge: reward.badge?.trim() || undefined,
    isActive: reward.isActive
})

const sortRewards = <T extends { day: number | "" }>(rewards: T[]) => {
    return rewards.sort((a, b) => Number(a.day) - Number(b.day))
}

const validateReward = (reward: RewardDraft): string | null => {
    if (Number(reward.day) <= 0) return "День награды должен быть больше 0"
    if (reward.title.trim() === "") return `Введите название награды за ${reward.day} день`
    if (reward.description.trim() === "") return `Введите описание награды за ${reward.day} день`
    return null
}

const validateRewards = (rewards: RewardDraft[]): string | null => {
    const invalid = rewards.map(validateReward).find(Boolean)
    if (invalid) return invalid

    const days = new Set<number>()

    for (const reward of rewards) {
        const day = Number(reward.day)

        if (days.has(day)) {
            return `Награда за ${day} день дублируется в таблице`
        }

        days.add(day)
    }

    return null
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

const BadgeSelect = (props: {
    value?: string | null
    onChange: (value: string) => void
}) => {
    const {
        value,
        onChange
    } = props

    const badge = value ? BadgesConfig.badges[value] : null

    return (
        <div className={styles.badgeSelect}>
            <select
                className={`${styles.input} ${styles.badgeSelectInput}`}
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                title={badge?.title ?? "Без badge"}
            >
                <option value="">Без badge</option>
                {badgeOptions.map(([id, badge]) => (
                    <option value={id} key={id}>{badge.title}</option>
                ))}
            </select>

            <span className={styles.badgePreview}>
                {badge ? (
                    <img src={badge.icon} alt={badge.title} draggable={false} />
                ) : (
                    <span>-</span>
                )}
            </span>
        </div>
    )
}

const RewardsSection = () => {
    const nextIdRef = useRef<number>(-1)
    const [items, setItems] = useState<RewardDraft[]>([])
    const [originalItems, setOriginalItems] = useState<RewardDraft[]>([])
    const [deletedIds, setDeletedIds] = useState<number[]>([])
    const [message, setMessage] = useState<string>("")
    const [pending, setPending] = useState<boolean>(false)

    const isDirty = useMemo(() => (
        deletedIds.length > 0 || JSON.stringify(items) !== JSON.stringify(originalItems)
    ), [deletedIds, items, originalItems])

    const load = useCallback(async () => {
        setPending(true)
        try {
            const data = await AdminApi.getStreakRewards()
            setItems(data)
            setOriginalItems(data)
            setDeletedIds([])
        } finally {
            setPending(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void load()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [load])

    const patchItem = useCallback((id: number, data: Partial<RewardDraft>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item))
    }, [])

    const add = useCallback(() => {
        setItems(prev => sortRewards([...prev, createEmptyReward(nextIdRef.current--)]))
    }, [])

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id))

        if (id > 0) {
            setDeletedIds(prev => [...prev, id])
        }
    }, [])

    const save = useCallback(async () => {
        setPending(true)
        setMessage("")

        try {
            const invalid = validateRewards(items)
            if (invalid) {
                setMessage(invalid)
                return
            }

            const originalById = new Map(originalItems.map(item => [item.id, item]))

            const saved = await Promise.all(items.map(item => {
                const payload = normalizeReward(item)

                if (item.isNew || item.id < 0) {
                    return AdminApi.createStreakReward(payload)
                }

                const original = originalById.get(item.id)
                if (original && JSON.stringify(item) === JSON.stringify(original)) {
                    return Promise.resolve(item as AdminStreakReward)
                }

                return AdminApi.updateStreakReward(item.id, payload)
            }))

            await Promise.all(deletedIds.map(id => AdminApi.deleteStreakReward(id)))

            const sorted = sortRewards(saved)
            setItems(sorted)
            setOriginalItems(sorted)
            setDeletedIds([])
            setMessage("Изменения сохранены")
        } catch (error) {
            setMessage(getErrorMessage(error, "Не удалось сохранить изменения"))
        } finally {
            setPending(false)
        }
    }, [deletedIds, items, originalItems])

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <div>
                    <h1>Награды огонька</h1>
                    <p>Редактирование наград за дни стрика с общим сохранением.</p>
                </div>

                <div className={styles.headerActions}>
                    <span className={styles.message}>{pending ? "Загрузка..." : message}</span>
                    <Button className={styles.secondary} onClick={add} isDisabled={pending}>Добавить</Button>
                    <Button className={styles.btn} onClick={save} isDisabled={pending || !isDirty}>Сохранить</Button>
                </div>
            </div>

            <div className={styles.table}>
                <div className={`${styles.head} ${styles.rewardGrid}`}>
                    <span>День</span><span>Название</span><span>Описание</span><span>Баланс</span><span>Badge</span><span>Вкл</span><span></span>
                </div>

                {items.length === 0 && <p className={styles.empty}>Наград пока нет</p>}

                {items.map(item => (
                    <div className={`${styles.row} ${styles.rewardGrid}`} key={item.id}>
                        <input className={styles.input} type="number" value={item.day} onChange={e => patchItem(item.id, { day: e.target.value === "" ? "" : Number(e.target.value) })} />
                        <input className={styles.input} value={item.title} onChange={e => patchItem(item.id, { title: e.target.value })} />
                        <input className={styles.input} value={item.description} onChange={e => patchItem(item.id, { description: e.target.value })} />
                        <input className={styles.input} type="number" value={item.balance} onChange={e => patchItem(item.id, { balance: e.target.value === "" ? "" : Number(e.target.value) })} />
                        <BadgeSelect value={item.badge} onChange={badge => patchItem(item.id, { badge })} />
                        <label className={styles.check}>
                            <input type="checkbox" checked={item.isActive} onChange={e => patchItem(item.id, { isActive: e.target.checked })} />
                        </label>
                        <Button className={styles.danger} onClick={() => remove(item.id)} isDisabled={pending}>Удалить</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(RewardsSection)
