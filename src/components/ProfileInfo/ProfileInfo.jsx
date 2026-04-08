import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import Placeholder from "../Placeholder"
import styles from "./ProfileInfo.module.css"

const ProfileInfo = (props) => {
    const {
        className = ""
    } = props

    const {
        head,
        user,
        isLoaded,
        account
    } = useContext(AccountContext)

    return (
        <div className={`${styles["profile-section"]} ${className}`}>
            <img src={head}
                width={64}
                height={64}
            />
            <div>
                <h1 className={styles.nickname}>{user?.username ?? "Username"}</h1>
                {isLoaded === true ?
                    <p className={styles.uuid}>{`ID: ${account.id}`}</p> :
                    <Placeholder />
                }
            </div>
        </div>
    )
}

export default ProfileInfo