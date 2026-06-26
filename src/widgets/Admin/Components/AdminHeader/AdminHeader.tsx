import { memo } from "react"
import styles from "./AdminHeader.module.css"
import Button from "@/Components/Controlls/Buttons/Button"
import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton"

const AdminHeader = () => {
    return (
        <nav className={styles.header}>
            <LinkedButton className={styles.btn} icon={false} to="/">Выйти</LinkedButton>
            <Button className={styles.btn}>Промокоды</Button>
            <Button className={styles.btn}>Награды</Button>
            <Button className={styles.btn}>Статистика</Button>
        </nav>
    )
}

export default memo(AdminHeader)