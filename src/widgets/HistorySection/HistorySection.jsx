import HistoryItem from "@/components/HistoryItem"
import HistoryList from "@/components/HistoryList"
import Button from "@/components/Button"
import { useState, useCallback, useEffect, useContext } from "react"
import Modal from 'react-modal'
import HistoryApi from "@/api/history"
import { AccountContext } from "@/context/AccountContext"
import styles from "./HistorySection.module.css"

const HistorySection = (props) => {
    const {
        className = ""
    } = props

    const {
        user
    } = useContext(AccountContext)

    const [historyModal, setHistotyModal] = useState(false);
    const [history, setHistory] = useState([])

    const openHistory = useCallback(() => {
        if(history.length !== 0)
            setHistotyModal(true)
    }, [history])
    
    const closeHistory = useCallback(() => setHistotyModal(false))

    useEffect(() => {
        HistoryApi.getByUuid(user?.minecraftUUID)
                  .then(data => setHistory(data.reverse() ?? []))
                  .catch(() => {
                        setHistory([])
                  })
    }, [user?.username])

    const rendered_list = history.slice(0, 5)

    return (
        <>
            <div className={`${styles["history-section"]} ${className}`}>
                <div className={styles.header}>
                    <Button className={styles["all-btn"]} onClick={openHistory}>История</Button>
                </div>

                {rendered_list.length > 0 ?
                    <div className={styles["history-list"]} >
                        {rendered_list.map(i => <HistoryItem key={i.id} data={i} index={null} />)}
                    </div> :
                    <p className={styles["not-found-message"]} >Тут пока ничего нет...</p>
                }
            </div>

            <Modal
                isOpen={historyModal}
                onRequestClose={closeHistory}
                contentLabel="Полная история игр"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <h1>История игр</h1>
                <HistoryList history={history} />
            </Modal>
        </>
    )
}

export default HistorySection