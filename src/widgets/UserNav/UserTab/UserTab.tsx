import { memo } from "react"
import UserInfo from "../UserInfo"
import styles from "./UserTab.module.css"
import Head from "@/Components/Decorations/Head"
import Separator from "@/Components/Decorations/Separator"
import UserControlls from "../UserControlls"

const UserTab = () => {
    return (
        <div className={styles.tab}>
            <div className={styles.info}>
                <Head size={48} />
                <UserInfo className={styles["info-content"]} />
            </div>

            <div className={styles.controlls}>
                <Separator size={100} className={styles.separator} />
                <UserControlls />
            </div>
        </div>
    )
}

export default memo(UserTab)