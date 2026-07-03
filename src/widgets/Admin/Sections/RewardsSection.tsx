import AdminApi, { type AdminStreakReward, type AdminStreakRewardPayload } from "@/Api/Admin"
import Button from "@/Components/Controlls/Buttons/Button"
import { BadgesConfig } from "@/Shared/Configs"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./AdminTables.module.css"

type RewardDraft = AdminStreakReward & { isNew?: boolean }

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
        void load()
    }, [load])

    const patchItem = useCallback((id: number, data: Partial<RewardDraft>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item))
    }, [])

    const add = useCallback(() => {
        setItems(prev => [...prev, createEmptyReward(nextIdRef.current--)].sort((a, b) => a.day - b.day))
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
            const originalById = new Map(originalItems.map(item => [item.id, item]))

            await Promise.all(deletedIds.map(id => AdminApi.deleteStreakReward(id)))

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

            const sorted = saved.sort((a, b) => a.day - b.day)
            setItems(sorted)
            setOriginalItems(sorted)
            setDeletedIds([])
            setMessage("Изменения сохранены")
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
                        <input className={styles.input} type="number" value={item.day} onChange={e => patchItem(item.id, { day: e.target.value === "" ? "" as any : Number(e.target.value) })} />
                        <input className={styles.input} value={item.title} onChange={e => patchItem(item.id, { title: e.target.value })} />
                        <input className={styles.input} value={item.description} onChange={e => patchItem(item.id, { description: e.target.value })} />
                        <input className={styles.input} type="number" value={item.balance} onChange={e => patchItem(item.id, { balance: e.target.value === "" ? "" as any : Number(e.target.value) })} />
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
