import { useCallback, useEffect, useRef } from "react"

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

    useEffect(() => {
        sound.current.playbackRate = config?.speed || 1
        sound.current.loop = config?.loop || false
        sound.current.volume = config?.volume || 1

        if(config?.onEnd) {
            sound.current.onended = config?.onEnd
        }

        if(config?.onStart) {
            sound.current.onplay = config?.onStart
        }
    }, [config])

    const play = useCallback(() => {
        if(!sound.current)
            return

        sound.current.currentTime = 0
        sound.current.play().catch((_) => _)

        isPlaying.current = true
    }, [])

    const stop = useCallback(() => {
        if(!sound.current)
            return

        sound.current.pause()

        isPlaying.current = false
    }, [])

    return {
        play,
        stop,
        isPlaying: isPlaying.current
    }
}

export default useSound