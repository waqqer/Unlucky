import styles from "./GlobalHistoryList.module.css"
import GlobalHistoryItem from "@/components/GlobalHistoryItem"
import { memo, useEffect, useState, useRef } from "react"

const GlobalHistoryList = (props) => {
    const {
        className = "",
        history = []
    } = props

    const [displayedHistory, setDisplayedHistory] = useState([])
    const [newItemIndices, setNewItemIndices] = useState(new Set())
    const prevHistoryRef = useRef([])
    const isFirstLoad = useRef(true)

    useEffect(() => {
        const reversed = history.slice().reverse()
        
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            setDisplayedHistory(reversed)
            setNewItemIndices(new Set())
            prevHistoryRef.current = reversed
            return
        }

        const newIndices = new Set()
        const prevIds = new Set(prevHistoryRef.current.map(item => item?.id))

        reversed.forEach((item, index) => {
            if (!prevIds.has(item?.id)) {
                newIndices.add(index)
            }
        })

        setDisplayedHistory(reversed)
        setNewItemIndices(newIndices)
        prevHistoryRef.current = reversed
    }, [history])

    if (!displayedHistory || displayedHistory.length === 0) {
        return (
            <div className={`${styles["history-list"]} ${className}`}>
                <p className={styles["not-found-message"]}>Тут пока ничего нет...</p>
            </div>
        )
    }

    return (
        <div className={`${styles["history-list"]} ${className}`}>
            {displayedHistory.map((item, index) => (
                <GlobalHistoryItem
                    key={item.id}
                    data={item}
                    index={index}
                    animate={newItemIndices.has(index)}
                />
            ))}
        </div>
    )
}

export default memo(GlobalHistoryList)
