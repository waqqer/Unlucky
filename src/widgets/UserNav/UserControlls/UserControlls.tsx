import { memo, useCallback } from "react"
import NavButton from "../NavButton/NavButton"
import styles from "./UserControlls.module.css"
import { toast } from "react-toastify"
import { randomElement } from "blaze-engine"
import Button from "@/Components/Controlls/Buttons/Button"

const UserControlls = () => {
    const handleClick = useCallback(() => {
        const handlers = [
            () => toast.dark("Default message"),
            () => toast.info("Info message"),
            () => toast.warn("Warn message"),
            () => toast.error("Error message"),
            () => toast.success("Succes message")
        ]

        randomElement(handlers)()
    }, [])
    return (
        <nav className={styles.controlls}>
            <NavButton onClick={handleClick}>
                Профиль
            </NavButton >

            <NavButton>
                Адм. панель
            </NavButton>

            <NavButton>
                О нас
            </NavButton>
        </nav>
    )
}

export default memo(UserControlls)