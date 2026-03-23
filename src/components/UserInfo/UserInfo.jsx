import { useContext } from "react"
import { AccountContext } from "../../context/AccountContext"
import "./UserInfo.css"

const UserInfo = () => {

    const {
        user,
        head
    } = useContext(AccountContext)

    return (
        <div className="user-about">
            <div className="user-avatar">
                <img 
                    src={head}
                    alt="Аватар клиента"
                    width={48}
                    height={48}
                />
            </div>
            <div className="user-info">
                <span className="user-nick">{user?.username ?? 'Username'}</span>
                <span className="user-balance">1000 Ар</span>
            </div>
        </div>
    )
}

export default UserInfo