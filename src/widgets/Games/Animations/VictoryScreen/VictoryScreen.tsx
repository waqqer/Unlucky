import { memo, useCallback, useEffect, useMemo, useRef } from "react"
import styles from "./VictoryScreen.module.css"
import Separator from "@/Components/Decorations/Separator"
import useCounter from "@/Hooks/useCounter"
import useKeybind from "@/Hooks/useKeybind"
import { VictoryScreenConfig } from "@/Shared/Configs/Pages"
import { getByWeight } from "@/Shared/Utils/Randomizer"
import useSound from "@/Hooks/useSound"

interface UIVictoryScreenProps {
    isActive: boolean,
    win: number
    onEnd?: () => void
}

const VictoryScreen = (props: UIVictoryScreenProps) => {
    const {
        isActive,
        win,
        onEnd
    } = props

    const {
        duration,
        fade_duration,
        counting_duration,
        screens
    } = VictoryScreenConfig

    const screenRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<number>(null)
    const stopVictorySoundRef = useRef<() => void>(() => undefined)

    const closeScreen = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        stopVictorySoundRef.current()
        screenRef.current?.classList.add(styles.fade)

        setTimeout(() => {
            onEnd?.()
        }, fade_duration)
    }, [fade_duration, onEnd])

    const value = useCounter(Math.floor(win), {
        duration: counting_duration
    })
    useKeybind(" ", closeScreen)

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (!isActive) {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            return
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        timerRef.current = setTimeout(() => {
            closeScreen()
        }, counting_duration + duration)

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [isActive, counting_duration, duration, closeScreen])

    const selectedScreens = useMemo(() => {
        return [...screens]
            .sort((a, b) => b.value_condition - a.value_condition)
            .find(s => win >= s.value_condition) ?? screens[0]
    }, [win, screens])
    const selectedData = useMemo(() => {
        if (selectedScreens?.data?.length) {
            const data = getByWeight(selectedScreens.data)
            return {
                video: data.video,
                audio: data.audio
            }
        }
        return {
            video: "",
            audio: ""
        }
    }, [selectedScreens])

    const {
        play: playVictorySound,
        stop: stopVictorySound
    } = useSound(selectedData.audio || "")

    stopVictorySoundRef.current = stopVictorySound

    useEffect(() => {
        if (isActive) {
            try {
                playVictorySound()
            } catch {
                console.error("Не удалось проиграть звук победы")
            }
        }

        return () => {
            stopVictorySound()
        }
    }, [isActive, playVictorySound, stopVictorySound])

    if (!isActive) {
        timerRef.current = null
        return
    }

    return (
        <div
            className={styles.screen}
            onClick={closeScreen}
            ref={screenRef}
        >
            {selectedData.video && (
                <video
                    className={styles.video}
                    autoPlay
                    playsInline
                    muted
                >
                    <source src={selectedData.video} type="video/webm" />
                </video>
            )}

            <div className={styles.message}>
                <h1>Победа!</h1>
                <Separator />
                <p>{value}</p>
            </div>
        </div>
    )
}

export default memo(VictoryScreen)
