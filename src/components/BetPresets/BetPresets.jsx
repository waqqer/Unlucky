import styles from "./BetPresets.module.css"

const BetPresets = (props) => {
    const {
        className,
        onSelect,
        disabled = false,
        presets = [10, 50, 100, 500]
    } = props

    return (
        <div className={`${styles["bet-presets"]} ${className}`}>
            {presets.map((preset) => (
                <button
                    key={preset}
                    className={styles["preset-btn"]}
                    onClick={() => onSelect(preset)}
                    disabled={disabled}
                >
                    {preset}
                </button>
            ))}
        </div>
    )
}

export default BetPresets
