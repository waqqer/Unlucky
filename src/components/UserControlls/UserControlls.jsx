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
        spm
    } = useContext(AccountContext)

    const idAdmin = true
    return (
        <div className={`${className}`}>
            <ProfileButton text="Профиль" onClick={openProfile} />
            {idAdmin === true && <ProfileButton text="Админ. панель" link="/admin" /> }
            <ProfileButton text="О нас" onClick={openAbout} />
        </div>
    )
}

export default UserControlls