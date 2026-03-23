import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import ProfileButton from "../ProfileButton"
import "./UserControlls.css"

const UserControlls = (props) => {
    const {
        openAbout,
        openProfile
    } = props

    const {
        spm
    } = useContext(AccountContext)

    const idAdmin = true
    return (
        <div className="user-controlls">
            <ProfileButton text="Профиль" onClick={openProfile} />
            {idAdmin === true && <ProfileButton text="Админ. панель" /> }
            <ProfileButton text="О нас" onClick={openAbout} />
        </div>
    )
}

export default UserControlls