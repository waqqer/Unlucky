import { useCallback, useRef } from "react"
import { ROCKET_CONFIG } from "@/shared/configs"

const { SOUND } = ROCKET_CONFIG

const useGameSounds = (enabled) => {
    const audioContextRef = useRef(null)

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        return audioContextRef.current
    }, [])

    const playTone = useCallback((frequency, duration, type = "sine") => {
        if (!enabled) return
        try {
            const ctx = getAudioContext()
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()
            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)
            oscillator.type = type
            oscillator.frequency.value = frequency
            gainNode.gain.setValueAtTime(SOUND.GAIN, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(SOUND.GAIN_DECAY, ctx.currentTime + duration)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + duration)
        } catch {
            /* noop */
        }
    }, [enabled, getAudioContext])

    const playStart = useCallback(() => playTone(SOUND.FREQ_START, SOUND.DURATION_START, "sine"), [playTone])

    const playCashOut = useCallback(() => {
        SOUND.FREQ_CASH_OUT.forEach((freq, i) => {
            setTimeout(() => playTone(freq, SOUND.DURATION_CASH_OUT[i], "sine"), i * 100)
        })
    }, [playTone])

    const playCrash = useCallback(() => playTone(SOUND.FREQ_CRASH, SOUND.DURATION_CRASH, "sawtooth"), [playTone])

    const playTick = useCallback(() => playTone(SOUND.FREQ_TICK, SOUND.DURATION_TICK, "sine"), [playTone])

    return { playStart, playCashOut, playCrash, playTick }
}

export default useGameSounds