import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./ProfileInfo.module.css"
import Placeholder from "../Placeholder"

const ProfileInfo = (props) => {
    const {
        className
    } = props

    const {
        user,
        isLoaded,
        account
    } = useContext(AccountContext)

    return (
        <div className={`${styles["profile-section"]} ${className}`}>
            <h1 className={styles.nickname}>{user?.username ?? "Username"}</h1>
            {isLoaded === true ?
                <p className={styles.uuid}>{account.id}</p> :
                <Placeholder />
            }
        </div>
    )
}

export default ProfileInfo