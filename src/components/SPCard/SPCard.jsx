import { memo, useMemo } from "react"
import styles from "./SPCard.module.css"

const colors = {
    0: "green",
    1: "purple",
    2: "gray",
    3: "red",
    4: "blue",
    5: "orange",
    6: "gold",
    7: "green",
    8: "pink",
    9: "yellow",
    10: "purple"
}

const SPCard = (props) => {
    const {
        code,
        name,
        onSelect,
        selected
    } = props

    const color = useMemo(() => {
        const num = Number(String(code)[0])
        return colors[num] || "gray"
    }, [code])

    return (
        <div className={`${styles.card} ${styles[color]} ${selected ? styles.selected : ""}`} onClick={onSelect}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.code}>{code}</p>
        </div>
    )
}

export default memo(SPCard)