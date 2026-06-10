import { memo } from "react"
import styles from "./ProfileModal.module.css"
import UserTabInfo from "@/Components/User/UserTabInfo"
import Button from "@/Components/Controlls/Buttons/Button"
import { ButtonStyle } from "@/Components/Controlls/Buttons/types"

const ProfileModal = () => {
    return (
        <div className={styles.box} >
            <div className={styles.user}>
                <UserTabInfo
                    className={styles["user-info"]}
                    size={64}
                    usernameClass={styles.username}
                    avatarClass={styles.head}
                    balanceClass={styles.balance}
                />
            </div>

            <div className={styles["balance-section"]}>
                <div className={styles["balance-title"]}>
                    Баланс: <span>1000</span>
                </div>

                <div className={styles["balance-btn"]}>
                    <Button type={ButtonStyle.APPLY}>Пополнить</Button>
                    <Button>Вывести</Button>
                </div>
            </div>

            <div>
                
            </div>
        </div>
    )
}

export default memo(ProfileModal)