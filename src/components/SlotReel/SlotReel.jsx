import { memo, useRef, useState, useCallback } from "react"
import diamondImg from "@/shared/images/games/slots/diamond.webp"
import goldImg from "@/shared/images/games/slots/gold.webp"
import ironImg from "@/shared/images/games/slots/iron.webp"
import coalImg from "@/shared/images/games/slots/coal.webp"
import amethystImg from "@/shared/images/games/slots/amethyst.webp"
import starImg from "@/shared/images/games/slots/star.webp"
import redstoneImg from "@/shared/images/games/slots/redstone.webp"
import styles from "./SlotReel.module.css"

export const SYMBOL_IMAGES = {
    diamond: diamondImg,
    gold: goldImg,
    iron: ironImg,
    coal: coalImg,
    star: starImg,
    redstone: redstoneImg,
    amethyst: amethystImg
}

const SlotReel = (props) => {
    const {
        className = "",
        symbol,
        isSpinning = false,
        isStopped = false
    } = props

    const imageSrc = SYMBOL_IMAGES[symbol] || SYMBOL_IMAGES.coal
    const reelRef = useRef(null)
    const [tiltStyle, setTiltStyle] = useState({})

    const handleMouseMove = useCallback((e) => {
        if (!reelRef.current) return
        
        const rect = reelRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY
        
        const rotateX = (mouseY / rect.height) * -60
        const rotateY = (mouseX / rect.width) * 60
        
        setTiltStyle({
            transform: `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`,
        })
    }, [])

    const handleMouseLeave = useCallback(() => {
        setTiltStyle({})
    }, [])

    return (
        <div 
            ref={reelRef}
            className={`${styles["slot-reel"]} ${className} ${isSpinning ? styles.spinning : ""} ${isStopped ? styles.stopped : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles["reel-content"]} style={isSpinning ? {} : tiltStyle}>
                <img
                    src={imageSrc}
                    alt={symbol}
                    className={styles.symbol}
                    draggable={false}
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default memo(SlotReel)
