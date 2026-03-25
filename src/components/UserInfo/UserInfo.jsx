import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import Placeholder from "../Placeholder"
import styles from "./UserInfo.module.css"

const UserInfo = () => {

    const {
        user,
        head,
        account,
        isLoaded
    } = useContext(AccountContext)

    return (
        <div className={styles["user-about"]}>
            <div className={styles["user-avatar"]}>
                <img 
                    src={head}
                    alt="Аватар клиента"
                    width={48}
                    height={48}
                />
            </div>
            <div className={styles["user-info"]}>
                <span className={styles["user-nick"]}>{user?.username ?? 'Username'}</span>
                {isLoaded === true ? 
                    <span className={styles["user-balance"]}>{`${account.balance}`}</span> : 
                    <Placeholder />
                }
            </div>
        </div>
    )
}

export default UserInfo