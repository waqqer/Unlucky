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
        sound.current.playbackRate = config?.speed || 1
        sound.current.loop = config?.loop || false
        sound.current.volume = config?.volume || SoundConfig.volume
        sound.current.preload = "auto"

        if(config?.onEnd) {
            sound.current.onended = config?.onEnd
        }

        if(config?.onStart) {
            sound.current.onplay = config?.onStart
        }
    }, [config, SoundConfig.volume])

    const play = useCallback(() => {
        if(!SoundConfig.enable)
            return

        if(!sound.current)
            return

        sound.current.currentTime = 0
        sound.current.play().catch((_) => _)

        isPlaying.current = true
    }, [SoundConfig.enable])

    const stop = useCallback(() => {
        if(!SoundConfig.enable)
            return
        
        if(!sound.current)
            return

        sound.current.pause()

        isPlaying.current = false
    }, [SoundConfig.enable])

    return {
        play,
        stop,
        isPlaying: isPlaying.current
    }
}

export default useSound