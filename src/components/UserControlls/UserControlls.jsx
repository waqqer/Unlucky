import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import ProfileButton from "../ProfileButton"
import styles from "./UserControlls.module.css"

const UserControlls = (props) => {
    const {
        className = "",
        openAbout,
        openProfile,
        children
    } = props

    const {
        account,
        user
    } = useContext(AccountContext)

    return (
        <div className={`${className}`}>
            {user !== null && (
                <ProfileButton text="Профиль" onClick={openProfile} />
            )}
            {(account?.role ?? "USER") === "ADMIN" && <ProfileButton text="Админ. панель" link="/admin" />}
            <ProfileButton text="Рейтинг" link="/top" className="mobile-hide" />
            <ProfileButton text="О нас" onClick={openAbout} />
            {children}
            <ProfileButton text="Главная" link="/" className="pc-hide" />

            {user === null && account === null && (
                <p className={styles.warn}>Ошибка СПм!</p>
            )}
            {user !== null && account === null && (
                <p className={styles.warn}>Тех. работы!</p>
            )}
        </div>
    )
}

export default UserControlls