import AdminApi, { type AdminPromocode, type AdminPromocodePayload } from "@/Api/Admin"
import Button from "@/Components/Controlls/Buttons/Button"
import { BadgesConfig } from "@/Shared/Configs"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./PromocodesSection.module.css"

type PromoDraft = Omit<AdminPromocode, "balance" | "usageLimit"> & {
    balance: number | ""
    usageLimit: number | ""
    isNew?: boolean
}

const badgeOptions = Object.entries(BadgesConfig.badges)

const toInputDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const toPayloadDate = (value: string) => new Date(value).toISOString()

const isValidDate = (value: string) => {
    return value !== "" && !Number.isNaN(new Date(value).getTime())
}

const createEmptyPromo = (id: number): PromoDraft => ({
    id,
    code: "",
    balance: 0,
    badge: null,
    startDate: toInputDate(new Date().toISOString()),
    endDate: toInputDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
    isNew: true
})

const toDraft = (promo: AdminPromocode): PromoDraft => ({
    ...promo,
    startDate: toInputDate(promo.startDate),
    endDate: toInputDate(promo.endDate)
})

const normalizePromo = (promo: PromoDraft): AdminPromocodePayload => ({
    code: promo.code.trim().toUpperCase(),
    balance: Number(promo.balance) || 0,
    badge: promo.badge?.trim() || null,
    startDate: toPayloadDate(promo.startDate),
    endDate: toPayloadDate(promo.endDate),
    usageLimit: Number(promo.usageLimit) || 1,
    isActive: promo.isActive
})

const validatePromo = (promo: PromoDraft): string | null => {
    if (promo.code.trim() === "") return "У промокода должен быть код"
    if (!isValidDate(promo.startDate)) return `Некорректная дата старта у ${promo.code || "нового промокода"}`
    if (!isValidDate(promo.endDate)) return `Некорректная дата конца у ${promo.code || "нового промокода"}`
    if (new Date(promo.startDate) >= new Date(promo.endDate)) return `Дата конца должна быть позже старта у ${promo.code}`
    if (Number(promo.usageLimit) < 1) return `Лимит должен быть больше 0 у ${promo.code}`
    if (Number(promo.usageLimit) < Number(promo.usedCount)) return `Лимит меньше использований у ${promo.code}`
    return null
}

const validatePromos = (promos: PromoDraft[]): string | null => {
    const invalid = promos.map(validatePromo).find(Boolean)
    if (invalid) return invalid

    const codes = new Set<string>()

    for (const promo of promos) {
        const code = promo.code.trim().toUpperCase()

        if (codes.has(code)) {
            return `Промокод ${code} дублируется в таблице`
        }

        codes.add(code)
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

const PromocodesSection = () => {
    const nextIdRef = useRef<number>(-1)
    const [items, setItems] = useState<PromoDraft[]>([])
    const [originalItems, setOriginalItems] = useState<PromoDraft[]>([])
    const [deletedIds, setDeletedIds] = useState<number[]>([])
    const [message, setMessage] = useState<string>("")
    const [pending, setPending] = useState<boolean>(false)

    const isDirty = useMemo(() => (
        deletedIds.length > 0 || JSON.stringify(items) !== JSON.stringify(originalItems)
    ), [deletedIds, items, originalItems])

    const load = useCallback(async () => {
        setPending(true)
        try {
            const data = (await AdminApi.getPromocodes()).map(toDraft)
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

    const patchItem = useCallback((id: number, data: Partial<PromoDraft>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item))
    }, [])

    const add = useCallback(() => {
        setItems(prev => [createEmptyPromo(nextIdRef.current--), ...prev])
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
            const invalid = validatePromos(items)
            if (invalid) {
                setMessage(invalid)
                return
            }

            const originalById = new Map(originalItems.map(item => [item.id, item]))

            const saved = await Promise.all(items.map(item => {
                const payload = normalizePromo(item)

                if (item.isNew || item.id < 0) {
                    return AdminApi.createPromocode(payload)
                }

                const original = originalById.get(item.id)
                if (original && JSON.stringify(item) === JSON.stringify(original)) {
                    return Promise.resolve({
                        ...item,
                        startDate: toPayloadDate(item.startDate),
                        endDate: toPayloadDate(item.endDate)
                    } as AdminPromocode)
                }

                return AdminApi.updatePromocode(item.id, {
                    ...payload,
                    usedCount: Number(item.usedCount) || 0
                })
            }))

            await Promise.all(deletedIds.map(id => AdminApi.deletePromocode(id)))

            const drafts = saved.map(toDraft)
            setItems(drafts)
            setOriginalItems(drafts)
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
                    <h1>Промокоды</h1>
                    <p>Редактируй строки локально, затем сохрани изменения одной кнопкой.</p>
                </div>

                <div className={styles.headerActions}>
                    <span className={styles.message}>{pending ? "Загрузка..." : message}</span>
                    <Button className={styles.secondary} onClick={add} isDisabled={pending}>Добавить</Button>
                    <Button className={styles.btn} onClick={save} isDisabled={pending || !isDirty}>Сохранить</Button>
                </div>
            </div>

            <div className={styles.table}>
                <div className={`${styles.head} ${styles.promoGrid}`}>
                    <span>Код</span><span>Баланс</span><span>Badge</span><span>Старт</span><span>Конец</span><span>Лимит</span><span>Вкл / исп.</span><span></span>
                </div>

                {items.length === 0 && <p className={styles.empty}>Промокодов пока нет</p>}

                {items.map(item => (
                    <div className={`${styles.row} ${styles.promoGrid}`} key={item.id}>
                        <input className={styles.input} value={item.code} onChange={e => patchItem(item.id, { code: e.target.value })} />
                        <input className={styles.input} type="number" value={item.balance} onChange={e => patchItem(item.id, { balance: e.target.value === "" ? "" : Number(e.target.value) })} />
                        <BadgeSelect value={item.badge} onChange={badge => patchItem(item.id, { badge })} />
                        <input className={styles.input} type="datetime-local" value={item.startDate} onChange={e => patchItem(item.id, { startDate: e.target.value })} />
                        <input className={styles.input} type="datetime-local" value={item.endDate} onChange={e => patchItem(item.id, { endDate: e.target.value })} />
                        <input className={styles.input} type="number" value={item.usageLimit} onChange={e => patchItem(item.id, { usageLimit: e.target.value === "" ? "" : Number(e.target.value) })} />
                        <label className={styles.check}>
                            <input type="checkbox" checked={item.isActive} onChange={e => patchItem(item.id, { isActive: e.target.checked })} />
                            {item.usedCount}
                        </label>
                        <Button className={styles.danger} onClick={() => remove(item.id)} isDisabled={pending}>Удалить</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(PromocodesSection)
