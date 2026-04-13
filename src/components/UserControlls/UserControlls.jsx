import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import ProfileButton from "../ProfileButton"

const UserControlls = (props) => {
    const {
        className = "",
        openAbout,
        openProfile,
        children
    } = props

    const {
        account
    } = useContext(AccountContext)

    return (
        <div className={`${className}`}>
            <ProfileButton text="Профиль" onClick={openProfile} />
            {(account?.role ?? "USER") === "ADMIN" && <ProfileButton text="Админ. панель" link="/admin" /> }
            <ProfileButton text="О нас" onClick={openAbout} />
            {children}
            <ProfileButton text="Главная" link="/" className="pc-hide" />
        </div>
    )
}

export default UserControlls