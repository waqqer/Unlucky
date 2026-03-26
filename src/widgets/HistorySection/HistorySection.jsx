import HistoryItem from "@/components/HistoryItem"
import Button from "@/components/Button"
import { useState, useCallback } from "react"
import Modal from 'react-modal'
import styles from "./HistorySection.module.css"

const HistorySection = (props) => {
    const {
        className
    } = props

    const [historyModal, setHistotyModal] = useState(false);

    const openHistory = useCallback(() => setHistotyModal(true))
    const closeHistory = useCallback(() => setHistotyModal(false))

    const history_list = [{ id: 1, result: "WIN", amount: 12, game_name: "SLOTS" },
    { id: 2, result: "LOSE", amount: -43, game_name: "MINER" },
    { id: 3, result: "WIN", amount: 31, game_name: "MINER" },
    { id: 4, result: "WIN", amount: 2, game_name: "ROCKET" }]

    const rendered_list = history_list.slice(0, 5)

    return (
        <>
            <div className={`${styles["history-section"]} ${className}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>История</h1>
                    <Button className={styles["all-btn"]} onClick={openHistory}>Показать всё</Button>
                </div>

                {rendered_list.length > 0 ?
                    <div className={styles["history-list"]} >
                        {rendered_list.map(i => <HistoryItem key={i.id} data={i} />)}
                    </div> :
                    <p className={styles["not-found-message"]} >Тут пока ничего нет...</p>
                }
            </div>

            <Modal
                isOpen={historyModal}
                onRequestClose={closeHistory}
                contentLabel="О нас"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <h1> история </h1>
            </Modal>
        </>
    )
}

export default HistorySection