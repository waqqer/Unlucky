import { memo } from "react"
import HistoryItem from "@/components/HistoryItem"
import styles from "./HistoryList.module.css"

const HistoryList = (props) => {
    const {
        history = []
    } = props

    return (
        <div className={styles["history-list"]}>
            {history.length > 0 ?
                history.map((item, index) => (
                    <HistoryItem key={item.id} data={item} index={index} />
                )) :
                <p className={styles["not-found-message"]}>Тут пока ничего нет...</p>
            }
        </div>
    )
}

export default memo(HistoryList)
