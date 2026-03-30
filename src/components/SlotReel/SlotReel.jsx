import diamondImg from "@/shared/images/games/slots/diamond.png"
import goldImg from "@/shared/images/games/slots/gold.png"
import ironImg from "@/shared/images/games/slots/iron.png"
import coalImg from "@/shared/images/games/slots/coal.png"
import styles from "./SlotReel.module.css"

const SYMBOL_IMAGES = {
    diamond: diamondImg,
    gold: goldImg,
    iron: ironImg,
    coal: coalImg
}

const SlotReel = (props) => {
    const {
        className,
        symbol,
        isSpinning = false,
        isStopped = false
    } = props

    const imageSrc = SYMBOL_IMAGES[symbol] || SYMBOL_IMAGES.coal

    return (
        <div className={`${styles["slot-reel"]} ${className} ${isSpinning ? styles.spinning : ""} ${isStopped ? styles.stopped : ""}`}>
            <div className={styles["reel-content"]}>
                <img
                    src={imageSrc}
                    alt={symbol}
                    className={styles.symbol}
                    draggable={false}
                />
            </div>
        </div>
    )
}

export default SlotReel
