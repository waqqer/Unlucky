import { memo, useState, useContext, useCallback, useRef, useEffect } from "react"
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

const toNumber = (value) => (typeof value === "number" ? value : parseFloat(value) || 0)

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

    const stopAudio = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.playbackRate = AUDIO_PLAYBACK_RATE
    }, [])

    const clearTimers = useCallback(() => {
        if (spinIntervalRef.current) {
            clearInterval(spinIntervalRef.current)
            spinIntervalRef.current = null
        }
        if (autoRerollTimeoutRef.current) {
            clearTimeout(autoRerollTimeoutRef.current)
            autoRerollTimeoutRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!soundEnabled) stopAudio()
    }, [soundEnabled, stopAudio])

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            clearTimers()
        }
    }, [clearTimers])

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

    const handleCloseVictory = useCallback(() => {
        setShowVictory(false)
    }, [])

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

    const scheduleAutoReroll = useCallback(() => {
        autoRerollTimeoutRef.current = setTimeout(() => {
            if (!isMounted.current) return
            if (!autoRerollEnabledRef.current) return
            spin()
        }, AUTO_REROLL_DELAY_MS)
    }, [])

    const spin = useCallback(async () => {
        if (isRequestPending || isSpinning) return
        if (!demoModeRef.current && !accountRef.current?.UUID) return

        const currentBalance = toNumber(accountRef.current?.balance)
        const currentBet = toNumber(betRef.current)
        if (!demoModeRef.current && (
            currentBet < SLOTS_MIN_BET ||
            currentBet > SLOTS_MAX_BET ||
            currentBet > currentBalance
        )) {
            setAutoRerollEnabled(false)
            return
        }

        setWinAmount(null)
        setIsRequestPending(true)
        setStoppedReels(INITIAL_STOPPED)

        stopAudio()

        try {
            const result = demoModeRef.current
                ? await SlotsApi.demoSpin()
                : await SlotsApi.spin(accountRef.current.UUID, betRef.current)

            const win = (result?.winAmount || 0)
            const newBalance = demoModeRef.current ? accountRef.current?.balance || 0 : result.newBalance
            const combination = result.combination || INITIAL_REELS
            const multiplier = (result?.multiplier || 0)

            const balanceToUpdate = newBalance

            setIsSpinning(true)

            if (audioRef.current && soundEnabledRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.loop = true
                audioRef.current.playbackRate = AUDIO_PLAYBACK_RATE
                audioRef.current.play().catch(() => { })
            }

            let spinIndex = 0

            spinIntervalRef.current = setInterval(() => {
                if (!isMounted.current) {
                    clearTimers()
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
                        if (spinIntervalRef.current) {
                            clearInterval(spinIntervalRef.current)
                            spinIntervalRef.current = null
                        }
                        setWinAmount(win - bet)
                        setIsSpinning(false)
                        setIsRequestPending(false)

                        stopAudio()

                        const isWin = win > 0

                        if (!demoModeRef.current && balanceToUpdate !== undefined && isMounted.current) {
                            updateUser({ balance: balanceToUpdate.toString() })
                        }

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
                                scheduleAutoReroll()
                            } else {
                                const nextBalance = toNumber(balanceToUpdate ?? accountRef.current?.balance)
                                if (nextBalance >= betRef.current) {
                                    scheduleAutoReroll()
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
            console.error("Slots game error:", error)
            setIsSpinning(false)
            setIsRequestPending(false)
            setAutoRerollEnabled(false)
        }
    }, [isSpinning, isRequestPending, accountRef, updateUser, onGameComplete, onHistoryUpdate, stopAudio, clearTimers, scheduleAutoReroll])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    useEffect(() => {
        if (pendingAutoRerollAfterVictory && !showVictory && autoRerollEnabled) {
            setPendingAutoRerollAfterVictory(false)

            if (demoModeRef.current) {
                scheduleAutoReroll()
            } else {
                const currentBalance = toNumber(accountRef.current?.balance)
                if (currentBalance >= betRef.current) {
                    scheduleAutoReroll()
                } else {
                    setAutoRerollEnabled(false)
                }
            }
        }
    }, [showVictory, pendingAutoRerollAfterVictory, autoRerollEnabled, scheduleAutoReroll])

    const balance = toNumber(account?.balance)
    const hasEnoughBalance = demoMode || bet <= balance
    const isBetInRange = bet >= SLOTS_MIN_BET && bet <= SLOTS_MAX_BET
    const canSpin = !isRequestPending && !isSpinning && isBetInRange && hasEnoughBalance && !showVictory

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
                        {isSpinning ? "Крутим..." : "Сыграть"}
                    </Button>
                </div>
            </div>

            <VictoryScreen
                isOpen={showVictory}
                onClose={handleCloseVictory}
                winAmount={winAmount}
            />
        </>
    )
}

export default memo(SlotMachineGame)
