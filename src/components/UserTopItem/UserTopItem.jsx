import { memo } from "react"
import { useHead } from "@/hooks"
import styles from "./UserTopItem.module.css"

const UserTopItem = (props) => {
    const {
        number,
        userData = {
            id: 0,
            nickname: "example",
            uuid: "",
            amount: 10000,
            wins: 100000
        }
    } = props

    const head = useHead(userData.uuid)

    return (
        <div className={styles.item}>
            <div className={styles["user-info"]}>
                {number && <p className={styles.number}>{number}</p>}
                <img
                    className={styles.head}
                    src={head}
                    alt="user top head icon"
                    width={48}
                    height={48}
                    draggable={false}
                    loading="lazy"
                />

                <p className={styles.name}>{userData.nickname}</p>
            </div>

            <div className={styles.stats}>
                <p>Выигрыш: {userData.amount}</p>
                <p>Побед: {userData.wins}</p>
            </div>
        </div>
    )
}

export default memo(UserTopItem)