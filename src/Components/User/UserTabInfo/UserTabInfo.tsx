import { memo } from "react"
import styles from "./UserTabInfo.module.css"
import useHead from "@/Hooks/userHead"
import Username from "../Username";

const UserTabInfo = () => {
    const head = useHead();
    return (
        <div className={styles.about}>
            <div className={styles.avatar}>
                <img
                    src={head}
                    alt="Аватарка"
                    width={48}
                    height={48}
                    loading="lazy"
                    draggable="false"
                    className={styles.head}
                />
            </div>

            <div className={styles.info}>
                <Username className={styles.nickname} />

                <span className={styles.balance}>
                    1000
                </span>
            </div>
        </div>
    )
}

export default memo(UserTabInfo)