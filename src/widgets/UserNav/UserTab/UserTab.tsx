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
                <UserInfo />
            </div>

            <div className={styles.controlls}>
                <Separator size={100} />
                <UserControlls />
            </div>
        </div>
    )
}

export default memo(UserTab)