import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import ProfileButton from "../ProfileButton"

const UserControlls = (props) => {
    const {
        className,
        openAbout,
        openProfile
    } = props

    const {
        spm,
        account
    } = useContext(AccountContext)

    return (
        <div className={`${className}`}>
            <ProfileButton text="Профиль" onClick={openProfile} />
            {(account?.role ?? "USER") === "ADMIN" && <ProfileButton text="Админ. панель" link="/admin" /> }
            <ProfileButton text="О нас" onClick={openAbout} />
        </div>
    )
}

export default UserControlls