import styles from "./GlobalHistoryList.module.css"
import GlobalHistoryItem from "@/components/GlobalHistoryItem"
import { memo, useMemo, useRef } from "react"

const GlobalHistoryList = (props) => {
    const {
        className = "",
        history = []
    } = props

    const prevHistoryRef = useRef(history.slice().reverse())
    const reversed = useMemo(() => history.slice().reverse(), [history])

    const newItemIndices = useMemo(() => {
        const newIndices = new Set()
        const prevIds = new Set(prevHistoryRef.current.map(item => item?.id))

        reversed.forEach((item, index) => {
            if (!prevIds.has(item?.id)) {
                newIndices.add(index)
            }
        })

        prevHistoryRef.current = reversed
        return newIndices
    }, [reversed])

    if (!reversed || reversed.length === 0) {
        return (
            <div className={`${styles["history-list"]} ${className}`}>
                <p className={styles["not-found-message"]}>Тут пока ничего нет...</p>
            </div>
        )
    }

    return (
        <div className={`${styles["history-list"]} ${className}`}>
            {reversed.map((item, index) => (
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
