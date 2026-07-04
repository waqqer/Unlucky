import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { toast } from "react-toastify"
import styles from "./Slots.module.css"
import type { SlotsResult } from "@/Api/Game/Types"
import GameApi from "@/Api/Game"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"
import Config from "@/Shared/Configs/Game/Slots"
import type { GameProps, GameRef } from "@/Shared/Types/GameTypes"

const formatWinAmount = (bet: number, multiplier: number) => {
    return Math.max(0, Math.floor(bet * multiplier * 100) / 100)
}

const getSymbolKeys = () => Object.keys(Config.SYMBOLS)

const getRandomSymbol = () => {
    const keys = getSymbolKeys()
    return keys[Math.floor(Math.random() * keys.length)]
}

const Slots = forwardRef<GameRef, GameProps>((props, ref) => {
    const { data } = props
    const playIdRef = useRef(0)
    const isAnimatingRef = useRef(false)
    const autoRerollTimerRef = useRef<number | null>(null)
    const timeoutsRef = useRef<number[]>([])
    const animationFrameRefs = useRef<number[]>([])
    const stripRefs = useRef<(HTMLDivElement | null)[]>([])
    const audioPoolRef = useRef<HTMLAudioElement[]>([])
    const audioStopTimerRef = useRef<number | null>(null)
    const playRef = useRef<(bet?: number) => void>(() => undefined)

    const [symbols, setSymbols] = useState<string[]>(Config.INITIAL_SYMBOLS)
    const [reelStrips, setReelStrips] = useState<string[][]>(() => Config.INITIAL_SYMBOLS.map(symbol => [symbol]))
    const [stoppedReels, setStoppedReels] = useState<boolean[]>(() => Array.from({ length: Config.REEL_COUNT }, () => false))
    const [tiltStyles, setTiltStyles] = useState<string[]>(() => Array.from({ length: Config.REEL_COUNT }, () => ""))

    const { account } = useContext(AuthContext)
    const { disableReferralCodeApply, flushBalanceUpdate, incrementBalance, queueBalanceUpdate } = useContext(AccountContext)

    const clearAutoReroll = useCallback(() => {
        if (!autoRerollTimerRef.current) return
        window.clearTimeout(autoRerollTimerRef.current)
        autoRerollTimerRef.current = null
    }, [])

    const clearSpinTimers = useCallback(() => {
        timeoutsRef.current.forEach(timer => window.clearTimeout(timer))
        timeoutsRef.current = []
        animationFrameRefs.current.forEach(frame => window.cancelAnimationFrame(frame))
        animationFrameRefs.current = []
    }, [])

    const stopSpinSound = useCallback(() => {
        if (audioStopTimerRef.current) {
            window.clearTimeout(audioStopTimerRef.current)
            audioStopTimerRef.current = null
        }

        audioPoolRef.current.forEach(audio => {
            audio.volume = 0
            audio.pause()
            audio.currentTime = 0
            audio.loop = false
        })
    }, [])

    const playSpinSound = useCallback(() => {
        if (audioPoolRef.current.length === 0) {
            audioPoolRef.current = [0, 1, 2].map(() => {
                const audio = new Audio(Config.SPIN_SOUND)
                audio.preload = "auto"
                audio.volume = Config.SOUND_VOLUME
                return audio
            })
        }

        const audio = audioPoolRef.current.find(item => item.paused || item.ended) || audioPoolRef.current[0]
        if (!audio) return

        audio.pause()
        audio.currentTime = 0
        audio.volume = Config.SOUND_VOLUME
        audio.loop = false
        void audio.play().catch(() => undefined)

        audioStopTimerRef.current = window.setTimeout(() => {
            audio.volume = 0
            audio.pause()
            audio.currentTime = 0
            audioStopTimerRef.current = null
        }, Config.SPIN_SOUND_PLAY_MS)
    }, [])

    const handleMouseMove = useCallback((index: number, event: React.MouseEvent<HTMLDivElement>) => {
        if (isAnimatingRef.current) return

        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = event.clientX - centerX
        const mouseY = event.clientY - centerY
        const rotateX = (mouseY / rect.height) * -24
        const rotateY = (mouseX / rect.width) * 24

        setTiltStyles(prev => {
            const next = prev.map((value, valueIndex) => valueIndex === index ? value : "")
            next[index] = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`
            return next
        })
    }, [])

    const handleMouseLeave = useCallback((index: number) => {
        setTiltStyles(prev => {
            const next = [...prev]
            next[index] = ""
            return next
        })
    }, [])

    const resetTilt = useCallback(() => {
        setTiltStyles(Array.from({ length: Config.REEL_COUNT }, () => ""))
    }, [])

    const finishReel = useCallback((index: number, symbol: string) => {
        const strip = stripRefs.current[index]
        if (strip) {
            strip.style.transform = "translateY(0)"
        }

        setSymbols(prev => {
            const next = [...prev]
            next[index] = symbol
            return next
        })
        setReelStrips(prev => {
            const next = [...prev]
            next[index] = [symbol]
            return next
        })
        setStoppedReels(prev => {
            const next = [...prev]
            next[index] = true
            return next
        })

        const resetTransformTimer = window.setTimeout(() => {
            const currentStrip = stripRefs.current[index]
            if (currentStrip) {
                currentStrip.style.transform = "translateY(0)"
            }
        }, 0)
        const timer = window.setTimeout(() => {
            setStoppedReels(prev => {
                const next = [...prev]
                next[index] = false
                return next
            })
        }, 260)
        timeoutsRef.current.push(resetTransformTimer)
        timeoutsRef.current.push(timer)
    }, [])

    const animateReel = useCallback((reelIndex: number, totalSteps: number, duration: number, target: string) => {
        return new Promise<void>(resolve => {
            const strip = stripRefs.current[reelIndex]
            if (!strip) {
                finishReel(reelIndex, target)
                resolve()
                return
            }

            const startedAt = performance.now()
            let lastStep = 0

            const update = (now: number) => {
                const progress = Math.min(1, (now - startedAt) / duration)
                const easedProgress = 1 - Math.pow(1 - progress, 3)
                const offset = easedProgress * totalSteps
                const currentStep = Math.min(totalSteps, Math.floor(offset))

                strip.style.transform = `translateY(-${offset * 100}%)`

                if (currentStep > lastStep && currentStep < totalSteps) {
                    playSpinSound()
                    lastStep = currentStep
                }

                if (progress < 1) {
                    const frame = window.requestAnimationFrame(update)
                    animationFrameRefs.current.push(frame)
                    return
                }

                strip.style.transform = `translateY(-${totalSteps * 100}%)`
                finishReel(reelIndex, target)
                resolve()
            }

            const frame = window.requestAnimationFrame(update)
            animationFrameRefs.current.push(frame)
        })
    }, [finishReel, playSpinSound])

    const spinReels = useCallback((combination: string[]) => {
        clearSpinTimers()
        resetTilt()

        const keys = getSymbolKeys()
        const nextStrips: string[][] = []
        const reelSettings: {
            duration: number
            target: string
            totalSteps: number
        }[] = []

        for (let reelIndex = 0; reelIndex < Config.REEL_COUNT; reelIndex++) {
            const duration = Config.SPINNING_TIME + reelIndex * Config.STOP_STAGGER_MS
            const totalSteps = Math.max(10, Math.ceil(duration / (1000 / Config.SPIN_TICKS_PER_SEC)))
            const target = combination[reelIndex] && Config.SYMBOLS[combination[reelIndex]]
                ? combination[reelIndex]
                : keys[reelIndex % keys.length]
            const strip = [
                symbols[reelIndex] || Config.INITIAL_SYMBOLS[reelIndex % Config.INITIAL_SYMBOLS.length],
                ...Array.from({ length: totalSteps - 1 }, getRandomSymbol),
                target
            ]

            nextStrips[reelIndex] = strip
            reelSettings[reelIndex] = { duration, target, totalSteps }
        }

        setStoppedReels(Array.from({ length: Config.REEL_COUNT }, () => false))
        setReelStrips(nextStrips)

        const startTimer = window.setTimeout(() => {
            stripRefs.current.forEach(strip => {
                if (strip) {
                    strip.style.transform = "translateY(0)"
                }
            })
        }, 20)
        timeoutsRef.current.push(startTimer)

        return new Promise<void>(resolve => {
            const animationTimer = window.setTimeout(() => {
                Promise.all(reelSettings.map((settings, reelIndex) => {
                    return animateReel(reelIndex, settings.totalSteps, settings.duration, settings.target)
                })).then(() => {
                    stopSpinSound()
                    resolve()
                })
            }, 40)
            timeoutsRef.current.push(animationTimer)
        }).then(() => {
            stopSpinSound()
        })
    }, [animateReel, clearSpinTimers, resetTilt, stopSpinSound, symbols])

    const scheduleAutoReroll = useCallback((bet: number) => {
        if (!data?.isAutoreroll || data.isDemo) return

        clearAutoReroll()
        autoRerollTimerRef.current = window.setTimeout(() => {
            autoRerollTimerRef.current = null
            if (!data.isAutoreroll || data.isDemo || isAnimatingRef.current || !data.StateMachine.is("IDLE")) return
            playRef.current(bet)
        }, Config.AUTO_REROLL_DELAY_MS)
    }, [clearAutoReroll, data])

    const finishRound = useCallback(async (result: SlotsResult, bet: number, isDemo: boolean, playId: number) => {
        if (!data) return

        await spinReels(result.combination)
        if (playId !== playIdRef.current) return

        flushBalanceUpdate()
        isAnimatingRef.current = false

        if (isDemo) {
            data.StateMachine.changeState("IDLE")
            return
        }

        data.pushHistory(Math.trunc((result.multiplier > 0 ? bet * result.multiplier : 0) - bet))

        if (result.isWin) {
            data.setWinAmount(formatWinAmount(bet, result.multiplier))
            data.StateMachine.changeState("WIN")
            return
        }

        data.setWinAmount(0)
        data.StateMachine.changeState("IDLE")
        scheduleAutoReroll(bet)
    }, [data, flushBalanceUpdate, scheduleAutoReroll, spinReels])

    const runPlay = useCallback(async (bet: number, isDemo: boolean) => {
        if (!data || isAnimatingRef.current) return
        if (!isDemo && !account) return

        const playId = ++playIdRef.current
        let isBetDebited = false
        isAnimatingRef.current = true
        resetTilt()
        clearAutoReroll()
        data.StateMachine.changeState("PLAYING")

        try {
            if (!isDemo) {
                incrementBalance(-bet)
                isBetDebited = true
            }

            const result = isDemo
                ? await GameApi.playDemoSlots()
                : await GameApi.playSlots(account!.UUID, bet)

            if (playId !== playIdRef.current) return
            if (!isDemo) disableReferralCodeApply()
            if (!isDemo) queueBalanceUpdate(result.newBalance)
            await finishRound(result, bet, isDemo, playId)
        } catch {
            if (isBetDebited) {
                incrementBalance(bet)
            }
            stopSpinSound()
            isAnimatingRef.current = false
            data.StateMachine.changeState("IDLE")
            toast.error("Не удалось запустить слоты")
        }
    }, [account, clearAutoReroll, data, disableReferralCodeApply, finishRound, incrementBalance, queueBalanceUpdate, resetTilt, stopSpinSound])

    const play = useCallback((bet?: number) => {
        void runPlay(bet ?? data?.bet ?? 0, false)
    }, [data, runPlay])

    const playDemo = useCallback(() => {
        void runPlay(data?.bet ?? 0, true)
    }, [data, runPlay])

    useEffect(() => {
        playRef.current = play
    }, [play])

    useImperativeHandle(ref, () => ({ play, playDemo }), [play, playDemo])

    useEffect(() => {
        return () => {
            clearSpinTimers()
            clearAutoReroll()
            stopSpinSound()
        }
    }, [clearAutoReroll, clearSpinTimers, stopSpinSound])

    return (
        <div className={styles.slots}>
            <div className={styles.reels}>
                {reelStrips.map((strip, index) => (
                    <div
                        className={styles.card}
                        key={index}
                        onMouseMove={(event) => handleMouseMove(index, event)}
                        onMouseLeave={() => handleMouseLeave(index)}
                        style={{ transform: tiltStyles[index] || undefined }}
                    >
                        <div
                            className={`${styles.frame} ${stoppedReels[index] ? styles.stopped : ""}`}
                            style={{ backgroundImage: `url(${Config.REEL_TEXTURE})` }}
                        >
                            <div
                                className={styles.strip}
                                style={{ inset: Config.REEL_CONTENT_INSET }}
                                ref={(element) => {
                                    stripRefs.current[index] = element
                                }}
                            >
                                {strip.map((symbol, symbolIndex) => (
                                    <div className={styles["symbol-cell"]} key={`${symbol}-${symbolIndex}`}>
                                        <img
                                            className={styles.symbol}
                                            src={Config.SYMBOLS[symbol]}
                                            alt=""
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
})

export default memo(Slots)
