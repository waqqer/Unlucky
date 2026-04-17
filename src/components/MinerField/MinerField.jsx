import background from "@/shared/images/games/miner/background.jpg"
import styles from "./MinerField.module.css"

const MinerField = (props) => {
    const {
        soundEnabled = true
    } = props

    return (
        <div className={styles["miner-game"]} style={{
            backgroundImage: `url(${background})`
        }}>
            
        </div>
    )
}

export default MinerField