import { SettingsContext } from "@/Context/SettingsContext"
import { useCallback, useContext, useEffect, useRef } from "react"

interface UseSoundProps {
    speed?: number
    loop?: boolean
    volume?: number

    onStart?: () => void
    onEnd?: () => void
}

const useSound = (soundUrl: string, config?: UseSoundProps) => {
    const sound = useRef(new Audio(soundUrl))
    const isPlaying = useRef<boolean>(false)
    const { sound: SoundConfig } = useContext(SettingsContext)

    useEffect(() => {
        const audio = sound.current

        if (!soundUrl) {
            audio.pause()
            audio.removeAttribute("src")
            audio.load()
            isPlaying.current = false
            return
        }

        const nextSrc = new URL(soundUrl, window.location.href).href

        if (audio.src === nextSrc) {
            return
        }

        audio.pause()
        audio.currentTime = 0
        audio.src = soundUrl
        audio.load()
        isPlaying.current = false
    }, [soundUrl])

    useEffect(() => {
        sound.current.playbackRate = config?.speed || 1
        sound.current.loop = config?.loop || false
        sound.current.volume = config?.volume || SoundConfig.volume
        sound.current.preload = "auto"

        sound.current.onended = () => {
            isPlaying.current = false
            config?.onEnd?.()
        }

        sound.current.onplay = () => {
            isPlaying.current = true
            config?.onStart?.()
        }
    }, [config, SoundConfig.volume])

    const play = useCallback(() => {
        if(!SoundConfig.enable)
            return

        if(!soundUrl)
            return

        if(!sound.current)
            return

        sound.current.currentTime = 0
        sound.current.play().catch((_) => _)

        isPlaying.current = true
    }, [SoundConfig.enable, soundUrl])

    const stop = useCallback(() => {
        if(!sound.current)
            return

        sound.current.pause()
        sound.current.currentTime = 0

        isPlaying.current = false
    }, [])

    return {
        play,
        stop,
        isPlaying: isPlaying.current
    }
}

export default useSound
