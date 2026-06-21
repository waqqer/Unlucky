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

    const closeScreen = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        screenRef.current?.classList.add(styles.fade)

        setTimeout(() => {
            onEnd?.()
        }, fade_duration)
    }, [fade_duration])

    const value = useCounter(win, {
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

    const selectedScreens = useMemo(() => screens.find(s => win > s.value_condition), [win, screens])
    const selectedData = useMemo(() => {
        if (selectedScreens?.data) {
            const data = getByWeight(selectedScreens?.data)
            return {
                video: data.video,
                audio: data.audio
            }
        }
        return {
            video: selectedScreens?.data[0].video,
            audio: selectedScreens?.data[0].audio
        }
    }, [selectedScreens])

    const audio = useSound(selectedData.audio || "")

    useEffect(() => {
        if (isActive) {
            try {
                audio.play()
            } catch {
                console.error("Не удалось проиграть звук победы")
            }
        }
    }, [isActive])

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
            <video
                className={styles.video}
                autoPlay
                playsInline
                muted
            >
                <source src={selectedData.video} type="video/webm" />
            </video>

            <div className={styles.message}>
                <h1>Победа!</h1>
                <Separator />
                <p>{value}</p>
            </div>
        </div>
    )
}

export default memo(VictoryScreen)