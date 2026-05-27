import { memo, useEffect, useMemo, useRef } from "react"
import { BADGES_CONFIG } from "@/shared/configs"
import xp from "@/shared/audio/xp.mp3"
import styles from "./BadgeMessage.module.css"

const messageVolume = 0.05

const BadgeMessage = (props) => {
    const {
        badge = "",
        time = 3000,
        onClose
    } = props

    const boxRef = useRef(null)
    const soundRef = useRef(null)

    const b = useMemo(() => {
        return BADGES_CONFIG.badges[badge] || null
    }, [badge, BADGES_CONFIG])

    const c = useMemo(() => {
        if (b) {
            return BADGES_CONFIG.colors[b.quality]
        }
        return null
    }, [badge, b, BADGES_CONFIG])

    useEffect(() => {
        if (boxRef.current && soundRef.current) {
            const soundTimer = setTimeout(() => {
                soundRef.current.volume = messageVolume
                soundRef.current.play()
            }, 250)

            const timer = setTimeout(() => {
                boxRef.current.classList.add(styles.fade)
            }, time)

            const removeTimer = setTimeout(() => {
                onClose?.()
            }, time + 750)

            return () => {
                clearTimeout(timer)
                clearTimeout(removeTimer)
                clearTimeout(soundTimer)
            }
        }
    }, [boxRef.current, time, onClose, soundRef.current])

    if (!b) {
        return
    }

    return (
        <div className={styles["badge-message"]} style={{ "--color": c }} ref={boxRef}>
            <audio src={xp} ref={soundRef} preload="auto"></audio>
            <img
                className={styles.icon}
                src={b.icon}
                alt="badge icon"
                loading="lazy"
                draggable={false}
                width={65}
                height={65}
            />

            <div className={styles.info}>
                <h1 className={styles.message}>Получено достижение!</h1>
                <div className={styles.content}>
                    <h3 className={styles.title}>{b.title}</h3>

                    <p className={styles.desc}>{b.description}</p>
                </div>
            </div>
        </div>
    )
}

export default memo(BadgeMessage)