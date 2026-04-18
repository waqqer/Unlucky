import styles from "./BetInput.module.css"

const BetInput = (props) => {
    const {
        className = "",
        value,
        onChange,
        placeholder = "Введите ставку",
        min = 1,
        max = 10000,
        disabled = false
    } = props

    const handleChange = (e) => {
        const val = parseInt(e.target.value, 10)
        if (isNaN(val) || val < 0) {
            onChange(0)
        } else if (val < min) {
            onChange(min)
        } else if (val > max) {
            onChange(max)
        } else {
            onChange(val)
        }
    }

    const handleBlur = () => {
        const val = typeof value === "number" ? value : 0
        if (val < min) {
            onChange(min)
        } else if (val > max) {
            onChange(max)
        }
    }

    return (
        <div className={`${styles["bet-input-container"]} ${className}`}>
            <label className={styles.label}>Ставка</label>
            <input
                type="number"
                className={styles["bet-input"]}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                min={min}
                max={max}
                disabled={disabled}
            />
        </div>
    )
}

export default BetInput
