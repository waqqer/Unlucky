import { memo } from "react"
import NavButton from "../NavButton/NavButton"
import styles from "./UserControlls.module.css"

const UserControlls = () => {
    return (
        <nav className={styles.controlls}>
            <NavButton>
                Профиль
            </NavButton>

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