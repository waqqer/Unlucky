import { useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import { RocketApi } from "@/api/game"
import RocketGraph from "@/components/RocketGraph"
import RocketField from "@/components/RocketField"
import BetInput from "@/components/BetInput"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import AutoReroll from "@/components/AutoReroll"
import DemoMode from "@/components/DemoMode"
import styles from "./RocketGame.module.css"

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
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + duration)
        } catch {
        }
    }, [enabled, getAudioContext])

    const playStart = useCallback(() => playTone(440, 0.2, "sine"), [playTone])
    const playCashOut = useCallback(() => {
        playTone(523, 0.1, "sine")
        setTimeout(() => playTone(659, 0.1, "sine"), 100)
        setTimeout(() => playTone(784, 0.2, "sine"), 200)
    }, [playTone])
    const playCrash = useCallback(() => playTone(150, 0.4, "sawtooth"), [playTone])
    const playTick = useCallback(() => playTone(800, 0.05, "sine"), [playTone])

    return { playStart, playCashOut, playCrash, playTick }
}

const RocketGame = (props) => {
    const {
        className = "",
        onHistoryUpdate,
        soundEnabled = true
    } = props

    const { account, updateUser, getBalance } = useContext(AccountContext)
    const sounds = useGameSounds(soundEnabled)

    const isMountedRef = useRef(true)
    const animationFrameRef = useRef(null)
    const autoRerollTimeoutRef = useRef(null)
    const startGameRef = useRef(null)
    const hasCashedOutRef = useRef(false)
    const currentMultiplierRef = useRef(0.7)
    const betRef = useRef(10)
    const demoModeRef = useRef(false)
    const isFlyingRef = useRef(false)
    const isRequestPendingRef = useRef(false)
    const autoRerollEnabledRef = useRef(false)
    const pendingAutoRerollRef = useRef(false)
    const crashedPointRef = useRef(null)

    const [bet, setBet] = useState(10)
    const [isFlying, setIsFlying] = useState(false)
    const [isCrashed, setIsCrashed] = useState(false)
    const [currentMultiplier, setCurrentMultiplier] = useState(0.7)
    const [crashedPoint, setCrashedPoint] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [hasCashedOut, setHasCashedOut] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [autoRerollEnabled, setAutoRerollEnabled] = useState(false)
    const [demoMode, setDemoMode] = useState(false)

    useEffect(() => {
        betRef.current = bet
    }, [bet])

    useEffect(() => {
        demoModeRef.current = demoMode
    }, [demoMode])

    useEffect(() => {
        autoRerollEnabledRef.current = autoRerollEnabled
    }, [autoRerollEnabled])

    useEffect(() => {
        isFlyingRef.current = isFlying
    }, [isFlying])

    useEffect(() => {
        isRequestPendingRef.current = isRequestPending
    }, [isRequestPending])

    useEffect(() => {
        crashedPointRef.current = crashedPoint
    }, [crashedPoint])

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
            if (autoRerollTimeoutRef.current) {
                clearTimeout(autoRerollTimeoutRef.current)
                autoRerollTimeoutRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        startGameRef.current = startGame
    })

    const handleAutoRerollToggle = useCallback(() => {
        setAutoRerollEnabled(prev => {
            const newValue = !prev
            if (!newValue && autoRerollTimeoutRef.current) {
                clearTimeout(autoRerollTimeoutRef.current)
                autoRerollTimeoutRef.current = null
            }
            return newValue
        })
    }, [])

    const handleDemoToggle = useCallback(() => {
        setDemoMode(prev => {
            const newMode = !prev
            if (newMode) {
                setAutoRerollEnabled(false)
            }
            return newMode
        })
    }, [])

    const handlePresetSelect = useCallback((preset) => {
        setBet(preset)
    }, [])

    const scheduleAutoReroll = useCallback((delay = 1000) => {
        if (!isMountedRef.current) return

        if (autoRerollTimeoutRef.current) {
            clearTimeout(autoRerollTimeoutRef.current)
            autoRerollTimeoutRef.current = null
        }

        autoRerollTimeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return
            if (!autoRerollEnabledRef.current) return
            if (demoModeRef.current) {
                startGameRef.current?.()
                return
            }

            const currentBalance = getBalance()
            if (currentBalance >= betRef.current) {
                startGameRef.current?.()
            } else {
                setAutoRerollEnabled(false)
            }
        }, delay)
    }, [getBalance])

    const startAnimation = useCallback((crashPoint) => {
        const startTime = Date.now()
        const duration = Math.max(crashPoint * 500, 1000)
        const startMult = 0.7
        const lastMilestone = { current: 1 }

        const animate = () => {
            if (!isMountedRef.current) return

            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const mult = startMult + (crashPoint - startMult) * progress
            const roundedMult = Math.round(mult * 100) / 100

            setCurrentMultiplier(roundedMult)
            currentMultiplierRef.current = roundedMult

            const currentWhole = Math.floor(roundedMult)
            if (currentWhole > lastMilestone.current && !hasCashedOutRef.current) {
                sounds.playTick()
                lastMilestone.current = currentWhole
            }

            if (progress < 1 && !hasCashedOutRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate)
                return
            }

            if (!hasCashedOutRef.current && isMountedRef.current) {
                setIsCrashed(true)
                setIsFlying(false)
                isFlyingRef.current = false
                sounds.playCrash()

                if (!demoModeRef.current) {
                    const userUuid = account?.UUID
                    if (userUuid) {
                        RocketApi.result(userUuid, betRef.current, crashedPointRef.current, false)
                            .then(result => {
                                if (result && typeof result.balance === "number") {
                                    updateUser({ balance: result.balance.toString() })
                                }
                                if (onHistoryUpdate) onHistoryUpdate()
                            })
                            .catch(err => {
                                console.error("Failed to send crash result:", err)
                                if (onHistoryUpdate) onHistoryUpdate()
                            })
                    }
                }

                if (autoRerollEnabledRef.current && isMountedRef.current) {
                    scheduleAutoReroll(1500)
                }
            }
        }

        animationFrameRef.current = requestAnimationFrame(animate)
    }, [sounds, onHistoryUpdate, scheduleAutoReroll])

    const startGame = useCallback(async () => {
        if (isRequestPendingRef.current || isFlyingRef.current) return
        if (!demoModeRef.current && !account?.UUID) return

        const currentBalance = getBalance()
        const currentBet = betRef.current
        if (!demoModeRef.current && (currentBet <= 0 || currentBet > currentBalance)) {
            setAutoRerollEnabled(false)
            return
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        if (autoRerollTimeoutRef.current) {
            clearTimeout(autoRerollTimeoutRef.current)
            autoRerollTimeoutRef.current = null
        }

        setIsRequestPending(true)
        isRequestPendingRef.current = true
        setHasCashedOut(false)
        hasCashedOutRef.current = false
        setIsCrashed(false)
        setCrashedPoint(null)
        crashedPointRef.current = null
        setWinAmount(null)
        setCurrentMultiplier(0.7)
        currentMultiplierRef.current = 0.7

        try {
            let crashPoint
            if (demoModeRef.current) {
                const r = Math.random()
                if (r < 0.33) {
                    crashPoint = 1 + Math.random() * 1.5
                } else if (r < 0.66) {
                    crashPoint = 2.5 + Math.random() * 2.5
                } else {
                    crashPoint = 5 + Math.random() * 10
                }
                crashPoint = Math.round(crashPoint * 100) / 100
            } else {
                const result = await RocketApi.crash()
                if (!result || typeof result.crashPoint !== "number" || result.crashPoint < 1) {
                    throw new Error("Некорректная точка краша от сервера")
                }
                crashPoint = result.crashPoint
            }

            setCrashedPoint(crashPoint)
            crashedPointRef.current = crashPoint
            setIsFlying(true)
            isFlyingRef.current = true
            setIsRequestPending(false)
            isRequestPendingRef.current = false

            sounds.playStart()
            startAnimation(crashPoint)
        } catch (error) {
            console.error("Rocket game error:", error)
            setIsRequestPending(false)
            isRequestPendingRef.current = false
            setIsFlying(false)
            isFlyingRef.current = false
            setAutoRerollEnabled(false)
        }
    }, [account, getBalance, sounds, startAnimation])

    const cashOut = useCallback(() => {
        if (!isFlyingRef.current || hasCashedOutRef.current || isCrashed) return

        const currentMult = currentMultiplierRef.current
        const currentBet = betRef.current

        if (currentMult < 1) {
            setHasCashedOut(true)
            hasCashedOutRef.current = true
            setIsFlying(false)
            isFlyingRef.current = false
            setIsCrashed(true)

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }

            setWinAmount(0)
            sounds.playCrash()

            if (!demoModeRef.current) {
                const userUuid = account?.UUID
                if (userUuid) {
                    RocketApi.result(userUuid, betRef.current, currentMult, false)
                        .then(result => {
                            if (result && typeof result.balance === "number") {
                                updateUser({ balance: result.balance.toString() })
                            }
                            if (onHistoryUpdate) onHistoryUpdate()
                        })
                        .catch(err => {
                            console.error("Failed to send result:", err)
                            if (onHistoryUpdate) onHistoryUpdate()
                        })
                }
            }

            if (autoRerollEnabledRef.current && isMountedRef.current) {
                scheduleAutoReroll(1500)
            }
            return
        }

        const win = Math.round(currentBet * (currentMult - 1) * 100) / 100

        setHasCashedOut(true)
        hasCashedOutRef.current = true
        setIsFlying(false)
        isFlyingRef.current = false

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }

        setWinAmount(win)
        sounds.playCashOut()

        if (!demoModeRef.current) {
            const userUuid = account?.UUID
            if (!userUuid) {
                console.error("Cannot cash out: user UUID not found")
                return
            }

            RocketApi.result(userUuid, currentBet, currentMult, true)
                .then(result => {
                    if (result && typeof result.balance === "number") {
                        updateUser({ balance: result.balance.toString() })
                    }
                    if (onHistoryUpdate) onHistoryUpdate()
                })
                .catch(err => {
                    console.error("Failed to send result:", err)
                    if (onHistoryUpdate) onHistoryUpdate()
                })

            setShowVictory(true)
            pendingAutoRerollRef.current = autoRerollEnabledRef.current
        } else {
            setTimeout(() => {
                if (!isMountedRef.current) return
                setHasCashedOut(false)
                hasCashedOutRef.current = false
                setIsCrashed(false)
            }, 500)
        }
    }, [isCrashed, account, updateUser, onHistoryUpdate, sounds])

    useEffect(() => {
        if (pendingAutoRerollRef.current && !showVictory) {
            pendingAutoRerollRef.current = false
            scheduleAutoReroll(1000)
        }
    }, [showVictory, scheduleAutoReroll])

    return (
        <>
            <div className={`${styles["rocket-game"]} ${className}`}>
                <div className={styles["game-area"]}>
                    <RocketGraph
                        multiplier={currentMultiplier}
                        isCrashed={isCrashed}
                        isFlying={isFlying}
                        crashedPoint={crashedPoint}
                    />
                    <RocketField
                        multiplier={currentMultiplier}
                        isCrashed={isCrashed}
                        crashedPoint={crashedPoint}
                    />
                </div>

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <BetInput
                            value={bet}
                            onChange={setBet}
                            disabled={isRequestPending || isFlying}
                            min={1}
                            max={100}
                        />
                        <BetPresets
                            onSelect={handlePresetSelect}
                            disabled={isRequestPending || isFlying}
                            presets={[1, 5, 10, 50, 100]}
                        />
                    </div>

                    <AutoReroll
                        enabled={autoRerollEnabled}
                        onToggle={handleAutoRerollToggle}
                        disabled={demoMode}
                    />

                    <DemoMode
                        enabled={demoMode}
                        onToggle={handleDemoToggle}
                        disabled={isFlying}
                    />

                    {!isFlying ? (
                        <Button
                            className={styles["play-btn"]}
                            onClick={startGame}
                            isDisabled={isRequestPending || bet < 1}
                            activateOnSpace={true}
                        >
                            {isRequestPending ? "Загрузка..." : "Сыграть"}
                        </Button>
                    ) : (
                        <Button
                            className={currentMultiplier < 1 ? styles["cashout-btn-danger"] : styles["cashout-btn"]}
                            onClick={cashOut}
                            isDisabled={hasCashedOut || isCrashed}
                            activateOnSpace={true}
                        >
                            {hasCashedOut ? "Забрано!" : currentMultiplier < 1
                                ? `Забрать (поражение!) ${(bet * currentMultiplier).toFixed(2)} Ар`
                                : `Забрать ${(bet * currentMultiplier).toFixed(2)} Ар`
                            }
                        </Button>
                    )}
                </div>
            </div>

            {!demoMode && (
                <VictoryScreen
                    isOpen={showVictory}
                    onClose={() => setShowVictory(false)}
                    winAmount={winAmount}
                />
            )}
        </>
    )
}

export default RocketGame
