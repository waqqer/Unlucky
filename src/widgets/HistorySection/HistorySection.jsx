import HistoryItem from "@/components/HistoryItem"
import Button from "@/components/Button"
import { useState, useCallback, useEffect, useContext } from "react"
import Modal from 'react-modal'
import HistoryApi from "@/api/history"
import { AccountContext } from "@/context/AccountContext"
import styles from "./HistorySection.module.css"

const HistorySection = (props) => {
    const {
        className
    } = props

    const {
        user
    } = useContext(AccountContext)

    const [historyModal, setHistotyModal] = useState(false);
    const [history, setHistory] = useState([])

    const openHistory = useCallback(() => setHistotyModal(true))
    const closeHistory = useCallback(() => setHistotyModal(false))

    useEffect(() => {
        HistoryApi.getByName(user?.username ?? "")
                  .then(data => setHistory(data))
                  .catch(_ => {
                        setHistory([])
                        console.warn("Failed to load user history")
                  })
    }, [])

    const rendered_list = history.slice(0, 5)

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