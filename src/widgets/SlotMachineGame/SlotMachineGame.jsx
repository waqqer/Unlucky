import { useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import { SlotsApi } from "@/api/game"
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

const SYMBOLS = ["star", "amethyst", "redstone", "coal", "iron", "gold", "diamond"]

const SlotMachineGame = (props) => {
    const {
        className,
        onGameComplete,
        onHistoryUpdate,
        soundEnabled = true
    } = props

    const { account, updateUser } = useContext(AccountContext)
    const isMounted = useRef(true)
    const spinIntervalRef = useRef(null)
    const autoRerollTimeoutRef = useRef(null)
    const audioRef = useRef(null)
    const autoRerollEnabledRef = useRef(false)

    const [reels, setReels] = useState(["coal", "coal", "coal"])
    const [bet, setBet] = useState(8)
    const [isSpinning, setIsSpinning] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [stoppedReels, setStoppedReels] = useState([false, false, false])

    const [autoRerollEnabled, setAutoRerollEnabled] = useState(false)
    const [consecutiveLosses, setConsecutiveLosses] = useState(0)

    const [demoMode, setDemoMode] = useState(false)
    const [pendingAutoRerollAfterVictory, setPendingAutoRerollAfterVictory] = useState(false)

    useEffect(() => {
        autoRerollEnabledRef.current = autoRerollEnabled
    }, [autoRerollEnabled])

    useEffect(() => {
        if (!soundEnabled && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.playbackRate = 1.2
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
        if (isRequestPending || isSpinning) {
            console.warn("Spin blocked:", { isRequestPending, isSpinning })
            return
        }

        if (!demoMode && !account?.UUID) {
            console.warn("Spin blocked: user not authenticated")
            return
        }

        const currentBalance = parseFloat(account?.balance || 0)
        if (!demoMode && (bet <= 0 || bet > currentBalance)) {
            console.warn("Недостаточно средств или неверная ставка", { bet, currentBalance })
            setAutoRerollEnabled(false)
            return
        }

        setWinAmount(null)
        setIsRequestPending(true)
        setStoppedReels([false, false, false])

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        try {
            const result = demoMode
                ? await SlotsApi.demoSpin()
                : await SlotsApi.spin(account.UUID, bet)

            const win = demoMode ? 0 : (result.winAmount || 0)
            const newBalance = demoMode ? account?.balance || 0 : result.newBalance
            const combination = result.combination || ["coal", "coal", "coal"]
            const multiplier = demoMode ? 0 : (result.multiplier || 0)

            if (!demoMode && newBalance !== undefined && isMounted.current) {
                updateUser({ balance: newBalance.toString() })
            }

            setIsSpinning(true)

            if (audioRef.current && soundEnabled) {
                audioRef.current.currentTime = 0
                audioRef.current.loop = true
                audioRef.current.playbackRate = 1.2
                audioRef.current.play().catch(err => {
                    console.warn("Audio play failed:", err)
                })
            }

            let spinIndex = 0
            const maxSpins = 20
            const reelDelays = [0, 8, 15]

            spinIntervalRef.current = setInterval(() => {
                if (!isMounted.current) {
                    clearInterval(spinIntervalRef.current)
                    return
                }

                spinIndex++

                if (!soundEnabled && audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause()
                }

                setStoppedReels(prevStopped => {
                    const newStopped = [...prevStopped]
                    const newReels = []

                    for (let i = 0; i < 3; i++) {
                        if (!newStopped[i] && spinIndex >= maxSpins + reelDelays[i]) {
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

                        if (!demoMode) {
                            if (isWin) {
                                setShowVictory(true)
                                setConsecutiveLosses(0)

                                if (autoRerollEnabledRef.current) {
                                    setPendingAutoRerollAfterVictory(true)
                                }
                            } else {
                                const newConsecutiveLosses = consecutiveLosses + 1
                                setConsecutiveLosses(newConsecutiveLosses)
                            }
                        }

                        if (onHistoryUpdate && !demoMode) {
                            onHistoryUpdate()
                        }

                        if (onGameComplete) {
                            onGameComplete({
                                combination,
                                multiplier,
                                win,
                                bet
                            })
                        }

                        if (!isWin && autoRerollEnabledRef.current && isMounted.current) {
                            if (demoMode) {
                                autoRerollTimeoutRef.current = setTimeout(() => {
                                    if (isMounted.current && autoRerollEnabledRef.current && demoMode) {
                                        spin()
                                    }
                                }, 500)
                            } else {
                                const nextBalance = parseFloat(newBalance || account.balance || 0)
                                if (nextBalance >= bet) {
                                    autoRerollTimeoutRef.current = setTimeout(() => {
                                        if (isMounted.current && autoRerollEnabledRef.current && !demoMode) {
                                            spin()
                                        }
                                    }, 500)
                                } else {
                                    setAutoRerollEnabled(false)
                                }
                            }
                        }
                    }

                    return newStopped
                })
            }, 100)

        } catch (error) {
            console.error("Ошибка при спине:", error)
            setIsSpinning(false)
            setIsRequestPending(false)
            setAutoRerollEnabled(false)
        }
    }, [bet, isSpinning, isRequestPending, account, demoMode, updateUser, onGameComplete, onHistoryUpdate, autoRerollEnabled, consecutiveLosses, soundEnabled])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    useEffect(() => {
        if (pendingAutoRerollAfterVictory && !showVictory && autoRerollEnabled) {
            setPendingAutoRerollAfterVictory(false)

            if (demoMode) {
                autoRerollTimeoutRef.current = setTimeout(() => {
                    if (isMounted.current && autoRerollEnabledRef.current && demoMode) {
                        spin()
                    }
                }, 500)
            } else {
                const currentBalance = parseFloat(account?.balance || 0)
                if (currentBalance >= bet) {
                    autoRerollTimeoutRef.current = setTimeout(() => {
                        if (isMounted.current && autoRerollEnabledRef.current && !demoMode) {
                            spin()
                        }
                    }, 500)
                } else {
                    setAutoRerollEnabled(false)
                }
            }
        }
    }, [showVictory, pendingAutoRerollAfterVictory, autoRerollEnabled, demoMode, account, bet, spin])

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
                            min={1}
                            max={10000}
                        />
                        <BetPresets
                            onSelect={handlePresetSelect}
                            disabled={isRequestPending || isSpinning}
                            presets={[1, 5, 10, 50, 500]}
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
                        isDisabled={isRequestPending || isSpinning || bet < 1}
                        activateOnSpace={true}
                    >
                        {isSpinning ? "Крутим..." : "Сыграть"}
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
