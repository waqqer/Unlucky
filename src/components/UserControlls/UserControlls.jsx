import ProfileButton from "../ProfileButton"
import "./UserControlls.css"

const UserControlls = () => {
    const idAdmin = true
    return (
        <div className="user-controlls">
            <ProfileButton text="Профиль" />
            {idAdmin === true && <ProfileButton text="Админ. панель" /> }
            <ProfileButton text="О нас" />
        </div>
    )
}

export default UserControlls