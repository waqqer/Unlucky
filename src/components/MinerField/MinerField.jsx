import styles from "./MinerField.module.css"

const MinerField = (props) => {
    const {
        soundEnabled = true
    } = props

    return (
        <div className={styles["miner-game"]}>
            DF
        </div>
    )
}

export default MinerField