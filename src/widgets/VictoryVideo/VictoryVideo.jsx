import { memo, useState } from "react"
import styles from "./VictoryVideo.module.css"

// Генерация случайных данных происходит только один раз при монтировании
const generateConfetti = () => 
    Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
        backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181'][
            Math.floor(Math.random() * 5)
        ]
    }))

const generateSparkles = () => 
    Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
    }))

const VictoryVideo = (props) => {
    const {
        className
    } = props

    // Генерируем данные только один раз при первом рендере
    const [confettiPieces] = useState(generateConfetti)
    const [sparkles] = useState(generateSparkles)

    return (
        <div className={`${styles["victory-video-container"]} ${className}`}>
            <div className={styles["confetti"]}>
                {confettiPieces.map((piece) => (
                    <div
                        key={piece.id}
                        className={styles["confetti-piece"]}
                        style={{
                            left: piece.left,
                            animationDelay: piece.animationDelay,
                            animationDuration: piece.animationDuration,
                            backgroundColor: piece.backgroundColor
                        }}
                    />
                ))}
            </div>
            <div className={styles["sparkles"]}>
                {sparkles.map((sparkle) => (
                    <div
                        key={sparkle.id}
                        className={styles["sparkle"]}
                        style={{
                            left: sparkle.left,
                            top: sparkle.top,
                            animationDelay: sparkle.animationDelay
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default memo(VictoryVideo)
