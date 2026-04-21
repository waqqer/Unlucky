import { memo, useCallback, useEffect, useState } from "react"
import styles from "./SPCard.module.css"

const colors = [
    "purple",
    "gray",
    "red",
    "blue"
]

const SPCard = (props) => {
    const {
        code,
        name,
        onSelect,
        selected
    } = props

    const [color, setColor] = useState("gray")

    useEffect(() => {
        setColor(colors[Math.round(Math.random() * colors.length - 1)])
    }, [])

    return (
        <div className={`${styles.card} ${styles[color]} ${selected ? styles.selected : ""}`} onClick={onSelect}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.code}>{code}</p>
        </div>
    )
}

export default memo(SPCard)