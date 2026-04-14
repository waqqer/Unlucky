import styles from "./RocketField.module.css"

const RocketField = ({ multiplier, isCrashed, crashedPoint }) => {
    const getColorByMultiplier = (mult) => {
        if (mult < 2) return "#60a5fa"
        if (mult < 3) return "#34d399"
        if (mult < 5) return "#a78bfa"
        if (mult < 10) return "#f472b6"
        return "#fbbf24"
    }

    const color = isCrashed ? "#ef4444" : getColorByMultiplier(multiplier)

    return (
        <div className={styles["rocket-field"]}>
            <div
                className={styles["multiplier"]}
                style={{
                    color: color,
                    textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`
                }}
            >
                {isCrashed ? crashedPoint.toFixed(2) : multiplier.toFixed(2)}x
            </div>
            {isCrashed && (
                <div className={styles["crashed-label"]}>БУУМ!!!</div>
            )}
        </div>
    )
}

export default RocketField
