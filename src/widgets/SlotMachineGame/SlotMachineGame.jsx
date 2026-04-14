import { useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import { SlotsApi } from "@/api/game"
import { useSyncRefs } from "@/hooks"
import { SLOTS_CONFIG } from "@/shared/configs"
import ReelsContainer from "@/components/ReelsContainer"
import SlotReel from "@/components/SlotReel"
import BetInput from "@/components/BetInput"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import AutoReroll from "@/components/AutoReroll"
import DemoMode from "@/components/DemoMode"
import slotSound from "@/shared/audio/slot.mp3"
import styles from "./SlotMachineGame.module.css"

const {
    REEL_COUNT,
    MAX_SPINS,
    SPIN_INTERVAL_MS,
    REEL_STOP_DELAYS,
    AUTO_REROLL_DELAY_MS,
    MIN_BET: SLOTS_MIN_BET,
    MAX_BET: SLOTS_MAX_BET,
    BET_PRESETS: SLOTS_BET_PRESETS,
    AUDIO_PLAYBACK_RATE,
    SYMBOLS,
    INITIAL_REELS,
    INITIAL_STOPPED
} = SLOTS_CONFIG

const SlotMachineGame = (props) => {
    const {
        className = "",
        onGameComplete,
        onHistoryUpdate,
        soundEnabled = true
    } = props

    const { account, updateUser } = useContext(AccountContext)
    const isMounted = useRef(true)
    const spinIntervalRef = useRef(null)
    const autoRerollTimeoutRef = useRef(null)
    const audioRef = useRef(null)

    const [reels, setReels] = useState(INITIAL_REELS)
    const [bet, setBet] = useState(10)
    const [isSpinning, setIsSpinning] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [stoppedReels, setStoppedReels] = useState(INITIAL_STOPPED)

    const [autoRerollEnabled, setAutoRerollEnabled] = useState(false)
    const [consecutiveLosses, setConsecutiveLosses] = useState(0)

    const [demoMode, setDemoMode] = useState(false)
    const [pendingAutoRerollAfterVictory, setPendingAutoRerollAfterVictory] = useState(false)

    const [autoRerollEnabledRef, demoModeRef, accountRef, betRef, soundEnabledRef] = useSyncRefs(
        autoRerollEnabled, demoMode, account, bet, soundEnabled
    )

    useEffect(() => {
        if (!soundEnabled && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.playbackRate = AUDIO_PLAYBACK_RATE
            audioRef.current.currentTime = 0
        }
    }, [soundEnabled])

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current)
            }
            if (autoRerollTimeoutRef.current) {
                clearTimeout(autoRerollTimeoutRef.current)
            }
        }
    }, [])

    const handleAutoRerollToggle = useCallback(() => {
        setAutoRerollEnabled(prev => {
            const newValue = !prev
            if (!newValue) {
                if (autoRerollTimeoutRef.current) {
                    clearTimeout(autoRerollTimeoutRef.current)
                    autoRerollTimeoutRef.current = null
                }
            }
            return newValue
        })
        setConsecutiveLosses(0)
    }, [])

    const handleDemoToggle = useCallback(() => {
        setDemoMode(prev => !prev)
    }, [])

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

    const spin = useCallback(async () => {
        if (isRequestPending || isSpinning) return
        if (!demoModeRef.current && !accountRef.current?.UUID) return

        const currentBalance = parseFloat(accountRef.current?.balance || 0)
        if (!demoModeRef.current && (betRef.current < SLOTS_MIN_BET || betRef.current > currentBalance)) {
            setAutoRerollEnabled(false)
            return
        }

        setWinAmount(null)
        setIsRequestPending(true)
        setStoppedReels(INITIAL_STOPPED)

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        try {
            const result = demoModeRef.current
                ? await SlotsApi.demoSpin()
                : await SlotsApi.spin(accountRef.current.UUID, betRef.current)

            const win = demoModeRef.current ? 0 : (result.winAmount || 0)
            const newBalance = demoModeRef.current ? accountRef.current?.balance || 0 : result.newBalance
            const combination = result.combination || INITIAL_REELS
            const multiplier = demoModeRef.current ? 0 : (result.multiplier || 0)

            if (!demoModeRef.current && newBalance !== undefined && isMounted.current) {
                updateUser({ balance: newBalance.toString() })
            }

            setIsSpinning(true)

            if (audioRef.current && soundEnabledRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.loop = true
                audioRef.current.playbackRate = AUDIO_PLAYBACK_RATE
                audioRef.current.play().catch(() => {})
            }

            let spinIndex = 0

            spinIntervalRef.current = setInterval(() => {
                if (!isMounted.current) {
                    clearInterval(spinIntervalRef.current)
                    return
                }

                spinIndex++

                if (!soundEnabledRef.current && audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause()
                }

                setStoppedReels(prevStopped => {
                    const newStopped = [...prevStopped]
                    const newReels = []

                    for (let i = 0; i < REEL_COUNT; i++) {
                        if (!newStopped[i] && spinIndex >= MAX_SPINS + REEL_STOP_DELAYS[i]) {
                            newReels[i] = combination[i]
                            newStopped[i] = true
                        } else if (!newStopped[i]) {
                            newReels[i] = getRandomSymbol()
                        } else {
                            newReels[i] = combination[i]
                        }
                    }

                    setReels(newReels)

                    if (newStopped.every(stopped => stopped)) {
                        clearInterval(spinIntervalRef.current)
                        setWinAmount(win)
                        setIsSpinning(false)
                        setIsRequestPending(false)

                        if (audioRef.current) {
                            audioRef.current.pause()
                            audioRef.current.currentTime = 0
                        }

                        const isWin = win > 0

                        if (!demoModeRef.current) {
                            if (isWin) {
                                setShowVictory(true)
                                setConsecutiveLosses(0)

                                if (autoRerollEnabledRef.current) {
                                    setPendingAutoRerollAfterVictory(true)
                                }
                            } else {
                                setConsecutiveLosses(prev => prev + 1)
                            }
                        }

                        if (onHistoryUpdate && !demoModeRef.current) {
                            onHistoryUpdate()
                        }

                        if (onGameComplete) {
                            onGameComplete({
                                combination,
                                multiplier,
                                win,
                                bet: betRef.current
                            })
                        }

                        if (!isWin && autoRerollEnabledRef.current && isMounted.current) {
                            if (demoModeRef.current) {
                                autoRerollTimeoutRef.current = setTimeout(() => {
                                    if (isMounted.current && autoRerollEnabledRef.current && demoModeRef.current) {
                                        spin()
                                    }
                                }, AUTO_REROLL_DELAY_MS)
                            } else {
                                const nextBalance = parseFloat(newBalance || accountRef.current?.balance || 0)
                                if (nextBalance >= betRef.current) {
                                    autoRerollTimeoutRef.current = setTimeout(() => {
                                        if (isMounted.current && autoRerollEnabledRef.current && !demoModeRef.current) {
                                            spin()
                                        }
                                    }, AUTO_REROLL_DELAY_MS)
                                } else {
                                    setAutoRerollEnabled(false)
                                }
                            }
                        }
                    }

                    return newStopped
                })
            }, SPIN_INTERVAL_MS)

        } catch (error) {
            setIsSpinning(false)
            setIsRequestPending(false)
            setAutoRerollEnabled(false)
        }
    }, [isSpinning, isRequestPending, accountRef, updateUser, onGameComplete, onHistoryUpdate])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    useEffect(() => {
        if (pendingAutoRerollAfterVictory && !showVictory && autoRerollEnabled) {
            setPendingAutoRerollAfterVictory(false)

            if (demoModeRef.current) {
                autoRerollTimeoutRef.current = setTimeout(() => {
                    if (isMounted.current && autoRerollEnabledRef.current && demoModeRef.current) {
                        spin()
                    }
                }, AUTO_REROLL_DELAY_MS)
            } else {
                const currentBalance = parseFloat(accountRef.current?.balance || 0)
                if (currentBalance >= betRef.current) {
                    autoRerollTimeoutRef.current = setTimeout(() => {
                        if (isMounted.current && autoRerollEnabledRef.current && !demoModeRef.current) {
                            spin()
                        }
                    }, AUTO_REROLL_DELAY_MS)
                } else {
                    setAutoRerollEnabled(false)
                }
            }
        }
    }, [showVictory, pendingAutoRerollAfterVictory, autoRerollEnabled])

    const balance = parseFloat(account?.balance || 0)
    const hasEnoughBalance = demoMode || bet <= balance
    const canSpin = !isRequestPending && !isSpinning && bet >= SLOTS_MIN_BET && hasEnoughBalance

    return (
        <>
            <div className={`${styles["slot-machine-game"]} ${className}`}>
                <audio ref={audioRef} src={slotSound} preload="auto" />

                <ReelsContainer className={styles["reels-container"]}>
                    {reels.map((symbol, index) => (
                        <SlotReel
                            key={index}
                            symbol={symbol}
                            isSpinning={isSpinning && !stoppedReels[index]}
                            isStopped={stoppedReels[index]}
                        />
                    ))}
                </ReelsContainer>

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <BetInput
                            value={bet}
                            onChange={setBet}
                            disabled={isRequestPending || isSpinning}
                            min={SLOTS_MIN_BET}
                            max={SLOTS_MAX_BET}
                        />
                        <BetPresets
                            className="sp-hide"
                            onSelect={handlePresetSelect}
                            disabled={isRequestPending || isSpinning}
                            presets={SLOTS_BET_PRESETS}
                        />
                    </div>

                    <AutoReroll
                        enabled={autoRerollEnabled}
                        onToggle={handleAutoRerollToggle}
                    />

                    <DemoMode
                        enabled={demoMode}
                        onToggle={handleDemoToggle}
                        disabled={isSpinning}
                    />

                    <Button
                        className={styles["spin-btn"]}
                        onClick={spin}
                        isDisabled={!canSpin}
                        activateOnSpace={true}
                        title={!hasEnoughBalance ? "Недостаточно средств" : undefined}
                    >
                        {isSpinning ? "Крутим..." : !hasEnoughBalance ? "Нет средств" : "Сыграть"}
                    </Button>
                </div>
            </div>

            <VictoryScreen
                isOpen={showVictory}
                onClose={() => setShowVictory(false)}
                winAmount={winAmount}
            />
        </>
    )
}

export default SlotMachineGame
