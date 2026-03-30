import styles from "./GlobalHistoryList.module.css"
import GlobalHistoryItem from "@/components/GlobalHistoryItem"

const GlobalHistoryList = (props) => {
    const {
        className,
        history = []
    } = props

    if (!history || history.length === 0) {
        return (
            <div className={`${styles["history-list"]} ${className}`}>
                <p className={styles["not-found-message"]}>Тут пока ничего нет...</p>
            </div>
        )
    }

    return (
        <div className={`${styles["history-list"]} ${className}`}>
            {history.slice().reverse().map((item, index) => (
                <GlobalHistoryItem 
                    key={item.id} 
                    data={item}
                    index={index}
                />
            ))}
        </div>
    )
}

export default GlobalHistoryList
