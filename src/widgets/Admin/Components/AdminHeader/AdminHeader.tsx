import { memo, useCallback, useState, forwardRef, useImperativeHandle } from "react"
import styles from "./AdminHeader.module.css"
import Button from "@/Components/Controlls/Buttons/Button"
import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton"

export type AdminSections = "PROMO" | "REWARDS" | "STATS" | "INFO"

export interface AdminHeaderRef {
    currentSection: AdminSections
}

interface UIAdminHeaderProps {
    onSectionChange?: (section: AdminSections) => void
}

const AdminHeader = forwardRef<AdminHeaderRef, UIAdminHeaderProps>((props, ref) => {
    const {
        onSectionChange
    } = props

    const [choosed, setChoosed] = useState<AdminSections>("INFO")

    const handleChoose = useCallback((section: AdminSections) => {
        setChoosed(section)
        onSectionChange?.(section)
    }, [])

    useImperativeHandle(ref, () => ({
        currentSection: choosed
    }))

    return (
        <nav className={styles.header}>
            <LinkedButton className={`${styles.btn} ${styles.exit}`} icon={false} to="/">Выйти</LinkedButton>
            <Button className={`${styles.btn} ${choosed === "PROMO" ? styles.active : ""}`} onClick={() => handleChoose("PROMO")}>Промокоды</Button>
            <Button className={`${styles.btn} ${choosed === "REWARDS" ? styles.active : ""}`} onClick={() => handleChoose("REWARDS")}>Награды</Button>
            <Button className={`${styles.btn} ${choosed === "STATS" ? styles.active : ""}`} onClick={() => handleChoose("STATS")}>Статистика</Button>
            <Button className={`${styles.btn} ${choosed === "INFO" ? styles.active : ""}`} onClick={() => handleChoose("INFO")}>Инфо</Button>
        </nav>
    )
})

export default memo(AdminHeader)