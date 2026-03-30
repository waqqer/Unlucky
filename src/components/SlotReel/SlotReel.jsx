import diamondImg from "@/shared/images/games/slots/diamond.png"
import goldImg from "@/shared/images/games/slots/gold.png"
import ironImg from "@/shared/images/games/slots/iron.png"
import coalImg from "@/shared/images/games/slots/coal.png"
import amethystImg from "@/shared/images/games/slots/amethyst.png"
import monyaImg from "@/shared/images/games/slots/monya.png"
import starImg from "@/shared/images/games/slots/star.png"
import redstoneImg from "@/shared/images/games/slots/redstone.png"
import styles from "./SlotReel.module.css"

const SYMBOL_IMAGES = {
    diamond: diamondImg,
    gold: goldImg,
    iron: ironImg,
    coal: coalImg,
    star: starImg,
    monya: monyaImg,
    redstone: redstoneImg,
    amethyst: amethystImg
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
