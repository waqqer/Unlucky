import { memo, useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import { AppContext } from "@/context/AppContext"
import { RocketApi } from "@/api/game"
import { useSyncRefs, useGameSounds } from "@/hooks"
import { ROCKET_CONFIG } from "@/shared/configs"
import RocketGraph from "@/components/RocketGraph"
import RocketField from "@/components/RocketField"
import BetInput from "@/components/BetInput"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import DemoMode from "@/components/DemoMode"
import styles from "./RocketGame.module.css"

const {
    START_MULTIPLIER,
    MULTIPLIER_SPEED,
    MULTIPLIER_PRECISION,
    MIN_BET: ROCKET_MIN_BET,
    MAX_BET: ROCKET_MAX_BET,
    BET_PRESETS: ROCKET_BET_PRESETS
} = ROCKET_CONFIG

const formatMoney = (value) => Number(value).toFixed(2)

const RocketGame = (props) => {
    const {
        className = "",
        onHistoryUpdate,
        soundEnabled = true
    } = props

    const { account, updateUser, getBalance, user } = useContext(AccountContext)
    const { sendWsMessage, subscribeWsMessage, isConnected } = useContext(AppContext)
    const sounds = useGameSounds(soundEnabled)

    const isMountedRef = useRef(true)
    const animationFrameRef = useRef(null)
    const smoothingFrameRef = useRef(null)
    const activeRoundIdRef = useRef(null)
    const hasCashedOutRef = useRef(false)
    const currentMultiplierRef = useRef(START_MULTIPLIER)
    const targetMultiplierRef = useRef(START_MULTIPLIER)
    const lastMilestoneRef = useRef(1)

    const [bet, setBet] = useState(10)
    const [isFlying, setIsFlying] = useState(false)
    const [isCrashed, setIsCrashed] = useState(false)
    const [currentMultiplier, setCurrentMultiplier] = useState(START_MULTIPLIER)
    const [crashedPoint, setCrashedPoint] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [hasCashedOut, setHasCashedOut] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [demoMode, setDemoMode] = useState(false)

    const [betRef, isFlyingRef, isRequestPendingRef, crashedPointRef, accountRef, soundsRef, demoModeRef] = useSyncRefs(
        bet, isFlying, isRequestPending, crashedPoint, account, sounds, demoMode
    )

    const stopAnimation = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [])

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            stopAnimation()
            if (smoothingFrameRef.current) {
                cancelAnimationFrame(smoothingFrameRef.current)
                smoothingFrameRef.current = null
            }
        }
    }, [stopAnimation])

    const resetRoundState = useCallback(() => {
        setHasCashedOut(false)
        hasCashedOutRef.current = false

        setIsCrashed(false)
        setCrashedPoint(null)
        crashedPointRef.current = null

        setWinAmount(null)
        setShowVictory(false)
        setCurrentMultiplier(START_MULTIPLIER)
        currentMultiplierRef.current = START_MULTIPLIER
        targetMultiplierRef.current = START_MULTIPLIER
        lastMilestoneRef.current = 1
    }, [crashedPointRef])

    const applyTick = useCallback((multiplier) => {
        const numericMultiplier = Number(multiplier)
        if (!Number.isFinite(numericMultiplier)) return
        targetMultiplierRef.current = numericMultiplier
    }, [])

    const applyMultiplierImmediately = useCallback((multiplier) => {
        const numericMultiplier = Number(multiplier)
        if (!Number.isFinite(numericMultiplier)) return
        setCurrentMultiplier(numericMultiplier)
        currentMultiplierRef.current = numericMultiplier
        targetMultiplierRef.current = numericMultiplier
    }, [])

    useEffect(() => {
        const smooth = () => {
            const current = currentMultiplierRef.current
            const target = targetMultiplierRef.current
            const diff = target - current

            if (Math.abs(diff) > 0.0001) {
                const next = current + diff * 0.22
                setCurrentMultiplier(next)
                currentMultiplierRef.current = next

                const currentWhole = Math.floor(next)
                if (currentWhole > lastMilestoneRef.current && !hasCashedOutRef.current) {
                    soundsRef.current.playTick()
                    lastMilestoneRef.current = currentWhole
                }
            }

            smoothingFrameRef.current = requestAnimationFrame(smooth)
        }

        smoothingFrameRef.current = requestAnimationFrame(smooth)

        return () => {
            if (smoothingFrameRef.current) {
                cancelAnimationFrame(smoothingFrameRef.current)
                smoothingFrameRef.current = null
            }
        }
    }, [soundsRef])

    useEffect(() => {
        if (demoModeRef.current) return undefined

        const isCurrentRoundMessage = (data) => {
            if (!activeRoundIdRef.current) return false
            if (!data || typeof data !== "object") return false
            // Backward-compatible mode: если сервер не прислал roundId,
            // считаем сообщение относящимся к текущему активному раунду.
            if (!("roundId" in data) || !data.roundId) return true
            return data.roundId === activeRoundIdRef.current
        }

        const unsubscribe = subscribeWsMessage((data) => {
            if (!isMountedRef.current) return

            switch (data.type) {
                case "game_started":
                    if (!data.roundId || typeof data.roundId !== "string") {
                        break
                    }
                    activeRoundIdRef.current = data.roundId
                    setIsRequestPending(false)
                    isRequestPendingRef.current = false
                    resetRoundState()
                    setIsFlying(true)
                    isFlyingRef.current = true
                    applyMultiplierImmediately(START_MULTIPLIER)
                    if (typeof data.balance === "number") {
                        updateUser({ balance: data.balance.toString() })
                    }
                    soundsRef.current.playStart()
                    break

                case "tick":
                    if (!isCurrentRoundMessage(data)) {
                        break
                    }
                    if (isFlyingRef.current && !hasCashedOutRef.current && typeof data.multiplier === "number") {
                        applyTick(data.multiplier)
                    }
                    break

                case "game_won":
                    if (!isCurrentRoundMessage(data)) {
                        break
                    }
                    setHasCashedOut(true)
                    hasCashedOutRef.current = true
                    setIsFlying(false)
                    isFlyingRef.current = false
                    if (typeof data.multiplier === "number") {
                        applyMultiplierImmediately(data.multiplier)
                    }
                    if (typeof data.winAmount === "number") {
                        setWinAmount(data.winAmount)
                    }
                    if (typeof data.balance === "number") {
                        updateUser({ balance: data.balance.toString() })
                    }
                    soundsRef.current.playCashOut()
                    setShowVictory(true)
                    break

                case "game_crash":
                    if (!isCurrentRoundMessage(data)) {
                        break
                    }
                    setIsCrashed(true)
                    setIsFlying(false)
                    isFlyingRef.current = false
                    if (typeof data.crashPoint === "number") {
                        setCrashedPoint(data.crashPoint)
                        crashedPointRef.current = data.crashPoint
                        applyMultiplierImmediately(data.crashPoint)
                    }
                    if (typeof data.balance === "number") {
                        updateUser({ balance: data.balance.toString() })
                    }
                    soundsRef.current.playCrash()
                    break

                case "game_settled":
                    // Для settled допускаем обновление баланса даже по старому раунду,
                    // чтобы не терять финализацию при out-of-order.
                    if (typeof data.balance === "number") {
                        updateUser({ balance: data.balance.toString() })
                    }

                    if (!isCurrentRoundMessage(data)) {
                        if (onHistoryUpdate) onHistoryUpdate()
                        break
                    }

                    const wasFlying = isFlyingRef.current
                    const settledIsWin = !!data.isWin

                    // Гарантируем финальный UI-стейт даже если клиент не успел
                    // обработать game_won/game_crash (race между событиями).
                    setIsFlying(false)
                    isFlyingRef.current = false

                    if (settledIsWin) {
                        const wasCashedOut = hasCashedOutRef.current
                        setHasCashedOut(true)
                        hasCashedOutRef.current = true
                        if (typeof data.multiplier === "number") {
                            applyMultiplierImmediately(data.multiplier)
                        }

                        if (!wasCashedOut && !showVictory) {
                            soundsRef.current.playCashOut()
                            setShowVictory(true)
                        }
                        setIsCrashed(false)
                    } else {
                        setHasCashedOut(false)
                        hasCashedOutRef.current = false
                        setIsCrashed(true)
                        if (typeof data.crashPoint === "number") {
                            setCrashedPoint(data.crashPoint)
                            crashedPointRef.current = data.crashPoint
                            applyMultiplierImmediately(data.crashPoint)
                        }
                        if (wasFlying) {
                            soundsRef.current.playCrash()
                        }
                    }

                    if (onHistoryUpdate) onHistoryUpdate()
                    activeRoundIdRef.current = null
                    break

                case "game_error":
                    console.error("Rocket game error:", data.message)
                    setIsRequestPending(false)
                    isRequestPendingRef.current = false
                    setIsFlying(false)
                    isFlyingRef.current = false
                    break

                default:
                    break
            }
        })

        return unsubscribe
    }, [
        subscribeWsMessage,
        updateUser,
        onHistoryUpdate,
        resetRoundState,
        applyTick,
        applyMultiplierImmediately,
        soundsRef,
        isCrashed,
        isFlyingRef,
        isRequestPendingRef,
        crashedPointRef,
        demoModeRef
    ])

    const handlePresetSelect = useCallback((preset) => {
        setBet(preset)
    }, [])

    const handleDemoToggle = useCallback(() => {
        setDemoMode(prev => !prev)
    }, [])

    const handleCloseVictory = useCallback(() => {
        setShowVictory(false)
    }, [])

    const startDemoAnimation = useCallback((crashPoint) => {
        const startTime = Date.now()
        const duration = ((crashPoint - START_MULTIPLIER) / MULTIPLIER_SPEED) * 1000
        const lastMilestone = { current: 1 }

        const animate = () => {
            if (!isMountedRef.current) return

            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const mult = START_MULTIPLIER + (crashPoint - START_MULTIPLIER) * progress
            const roundedMult = Math.round(mult * MULTIPLIER_PRECISION) / MULTIPLIER_PRECISION

            setCurrentMultiplier(roundedMult)
            currentMultiplierRef.current = roundedMult

            const currentWhole = Math.floor(roundedMult)
            if (currentWhole > lastMilestone.current && !hasCashedOutRef.current) {
                soundsRef.current.playTick()
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
                soundsRef.current.playCrash()
            }
        }

        animationFrameRef.current = requestAnimationFrame(animate)
    }, [isFlyingRef, soundsRef])

    const startDemoGame = useCallback(async () => {
        stopAnimation()
        resetRoundState()

        let roundedCrash = START_MULTIPLIER
        try {
            const result = await RocketApi.demo()
            if (!result || typeof result.crashPoint !== "number") {
                throw new Error("Некорректная точка краша для демо")
            }
            roundedCrash = Math.round(result.crashPoint * MULTIPLIER_PRECISION) / MULTIPLIER_PRECISION
        } catch (error) {
            console.error("Rocket demo error:", error)
            return
        }

        setCrashedPoint(roundedCrash)
        crashedPointRef.current = roundedCrash
        setIsFlying(true)
        isFlyingRef.current = true
        soundsRef.current.playStart()
        startDemoAnimation(roundedCrash)
    }, [resetRoundState, startDemoAnimation, stopAnimation, crashedPointRef, isFlyingRef, soundsRef])

    const startGame = useCallback(async () => {
        if (isRequestPendingRef.current || isFlyingRef.current) return

        if (demoModeRef.current) {
            startDemoGame()
            return
        }

        if (!accountRef.current?.UUID || !isConnected) return

        const currentBalance = getBalance()
        const currentBet = betRef.current
        if (
            currentBet < ROCKET_MIN_BET ||
            currentBet > ROCKET_MAX_BET ||
            currentBet > currentBalance
        ) {
            return
        }

        stopAnimation()
        resetRoundState()
        activeRoundIdRef.current = null

        setIsRequestPending(true)
        isRequestPendingRef.current = true

        sendWsMessage({ type: "start_game", bet: currentBet })
    }, [
        getBalance,
        resetRoundState,
        stopAnimation,
        startDemoGame,
        sendWsMessage,
        isConnected,
        accountRef,
        betRef,
        demoModeRef,
        isFlyingRef,
        isRequestPendingRef
    ])

    const cashOut = useCallback(() => {
        if (!isFlyingRef.current || hasCashedOutRef.current || isCrashed) return

        if (demoModeRef.current) {
            const currentMult = currentMultiplierRef.current
            const currentBet = betRef.current

            if (currentMult < 1) {
                setHasCashedOut(true)
                hasCashedOutRef.current = true
                setIsFlying(false)
                isFlyingRef.current = false
                setIsCrashed(true)
                stopAnimation()
                setWinAmount(0)
                soundsRef.current.playCrash()
                return
            }

            const win = Math.round(currentBet * (currentMult - 1) * MULTIPLIER_PRECISION) / MULTIPLIER_PRECISION

            setHasCashedOut(true)
            hasCashedOutRef.current = true
            setIsFlying(false)
            isFlyingRef.current = false
            stopAnimation()
            setWinAmount(win)
            soundsRef.current.playCashOut()

            setTimeout(() => {
                if (!isMountedRef.current) return
                setHasCashedOut(false)
                hasCashedOutRef.current = false
                setIsCrashed(false)
            }, 500)
            return
        }

        sendWsMessage({ type: "cashout", roundId: activeRoundIdRef.current || undefined })
    }, [isCrashed, sendWsMessage, stopAnimation, betRef, demoModeRef, isFlyingRef, soundsRef])

    return (
        <>
            <div className={`${styles["rocket-game"]} ${className}`}>
                <div className={styles["game-area"]}>
                    <RocketGraph
                        multiplier={currentMultiplier}
                        isCrashed={isCrashed}
                        isFlying={isFlying}
                        crashedPoint={crashedPoint}
                        hasCashedOut={hasCashedOut}
                    />
                    <RocketField
                        multiplier={currentMultiplier}
                        isCrashed={isCrashed}
                    />
                </div>

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <BetInput
                            value={bet}
                            onChange={setBet}
                            disabled={isRequestPending || isFlying}
                            min={ROCKET_MIN_BET}
                            max={ROCKET_MAX_BET}
                        />
                        <BetPresets
                            className="sp-hide"
                            onSelect={handlePresetSelect}
                            disabled={isRequestPending || isFlying}
                            presets={ROCKET_BET_PRESETS}
                        />
                    </div>

                    <DemoMode
                        enabled={demoMode}
                        onToggle={handleDemoToggle}
                        disabled={isFlying}
                    />

                    {!isFlying ? (
                        <Button
                            className={styles["play-btn"]}
                            onClick={startGame}
                            isDisabled={
                                isRequestPending ||
                                bet < ROCKET_MIN_BET ||
                                (!demoMode && (!user || !account || !isConnected)) ||
                                showVictory
                            }
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
                            {hasCashedOut ? "Забрано!" : `Забрать ${formatMoney(bet * currentMultiplier)} Ар`}
                        </Button>
                    )}
                </div>
            </div>

            {!demoMode && (
                <VictoryScreen
                    isOpen={showVictory}
                    onClose={handleCloseVictory}
                    winAmount={winAmount}
                />
            )}
        </>
    )
}

export default memo(RocketGame)
