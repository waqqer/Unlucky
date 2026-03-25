import HistoryItem from "../../components/HistoryItem"
import styles from "./HistorySection.module.css"

const HistorySection = (props) => {
    const {
        className
    } = props

    const history_list = [{id: 1, result: "WIN", amount: 12, game_name: "SLOTS"}, 
                          {id: 2, result: "LOSE", amount: -43, game_name: "MINER"}, 
                          {id: 3, result: "WIN", amount: 31, game_name: "MINER"}, 
                          {id: 4, result: "WIN", amount: 2, game_name: "ROCKET"}]

    const rendered_list = history_list.slice(0, 5)

    return (
        <div className={`${styles["history-section"]} ${className}`}>
            <h1 className={styles.title}>История</h1>

            {rendered_list.length > 0 ?
                <div className={styles["history-list"]} >
                    {rendered_list.map(i => <HistoryItem key={i.id} data={i} />)}
                </div> :
                <p className={styles["not-found-message"]} >Тут пока ничего нет...</p>
            }
        </div>
    )
}

export default HistorySection