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

    const select = useCallback(() => {
        onSelect({
            name,
            code
        })
    })

    return (
        <div className={`${styles.card} ${styles[color]} ${selected ? styles.selected : ""}`} onClick={select}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.code}>{code}</p>
        </div>
    )
}

export default memo(SPCard)