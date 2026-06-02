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
    const activeRoundIdRef = useRef(null)
    const roundPhaseRef = useRef("idle")
    const hasCashedOutRef = useRef(false)
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

    const updateUserRef = useRef(updateUser)
    const onHistoryUpdateRef = useRef(onHistoryUpdate)
    const showVictoryRef = useRef(showVictory)

    useEffect(() => {
        updateUserRef.current = updateUser
        onHistoryUpdateRef.current = onHistoryUpdate
        showVictoryRef.current = showVictory
    }, [updateUser, onHistoryUpdate, showVictory])

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
        }
    }, [stopAnimation])

    const applyMultiplier = useCallback((multiplier) => {
        const numericMultiplier = Number(multiplier)
        if (!Number.isFinite(numericMultiplier)) return

        setCurrentMultiplier(numericMultiplier)

        const currentWhole = Math.floor(numericMultiplier)
        if (
            roundPhaseRef.current === "running" &&
            currentWhole > lastMilestoneRef.current &&
            !hasCashedOutRef.current
        ) {
            soundsRef.current.playTick()
            lastMilestoneRef.current = currentWhole
        }
    }, [soundsRef])

    const resetRoundState = useCallback(() => {
        setHasCashedOut(false)
        hasCashedOutRef.current = false

        setIsCrashed(false)
        setCrashedPoint(null)
        crashedPointRef.current = null

        setWinAmount(null)
        setShowVictory(false)
        applyMultiplier(START_MULTIPLIER)
        lastMilestoneRef.current = 1
        roundPhaseRef.current = "idle"
    }, [applyMultiplier, crashedPointRef])

    const endRoundVisual = useCallback(() => {
        roundPhaseRef.current = "ended"
        setIsFlying(false)
        isFlyingRef.current = false
    }, [isFlyingRef])

    useEffect(() => {
        if (demoModeRef.current) return undefined

        const unsubscribe = subscribeWsMessage((data) => {
            if (!isMountedRef.current || !data || typeof data !== "object") return

            const roundId = typeof data.roundId === "string" ? data.roundId : null
            const isCurrentRound = roundId && roundId === activeRoundIdRef.current

            switch (data.type) {
                case "game_started": {
                    if (!roundId) break

                    activeRoundIdRef.current = roundId
                    roundPhaseRef.current = "running"

                    setIsRequestPending(false)
                    isRequestPendingRef.current = false
                    resetRoundState()
                    activeRoundIdRef.current = roundId
                    roundPhaseRef.current = "running"

                    setIsFlying(true)
                    isFlyingRef.current = true
                    applyMultiplier(START_MULTIPLIER)

                    if (typeof data.balance === "number") {
                        updateUserRef.current({ balance: data.balance.toString() })
                    }
                    soundsRef.current.playStart()
                    break
                }

                case "tick": {
                    if (!isCurrentRound || roundPhaseRef.current !== "running") break
                    if (typeof data.multiplier !== "number") break
                    applyMultiplier(data.multiplier)
                    break
                }

                case "game_won": {
                    if (!isCurrentRound) break

                    endRoundVisual()
                    setHasCashedOut(true)
                    hasCashedOutRef.current = true

                    if (typeof data.multiplier === "number") {
                        applyMultiplier(data.multiplier)
                    }
                    if (typeof data.winAmount === "number") {
                        setWinAmount(data.winAmount)
                    }
                    if (typeof data.balance === "number") {
                        updateUserRef.current({ balance: data.balance.toString() })
                    }

                    soundsRef.current.playCashOut()
                    setShowVictory(true)
                    break
                }

                case "game_crash": {
                    if (!isCurrentRound) break

                    endRoundVisual()
                    setHasCashedOut(false)
                    hasCashedOutRef.current = false
                    setIsCrashed(true)

                    if (typeof data.crashPoint === "number") {
                        setCrashedPoint(data.crashPoint)
                        crashedPointRef.current = data.crashPoint
                        applyMultiplier(data.crashPoint)
                    }
                    if (typeof data.balance === "number") {
                        updateUserRef.current({ balance: data.balance.toString() })
                    }

                    soundsRef.current.playCrash()
                    break
                }

                case "game_settled": {
                    if (typeof data.balance === "number") {
                        updateUserRef.current({ balance: data.balance.toString() })
                    }

                    if (!isCurrentRound) {
                        onHistoryUpdateRef.current?.()
                        break
                    }

                    endRoundVisual()

                    if (data.isWin) {
                        setHasCashedOut(true)
                        hasCashedOutRef.current = true
                        setIsCrashed(false)

                        if (typeof data.multiplier === "number") {
                            applyMultiplier(data.multiplier)
                        }
                        if (!showVictoryRef.current) {
                            setShowVictory(true)
                        }
                    } else {
                        setHasCashedOut(false)
                        hasCashedOutRef.current = false
                        setIsCrashed(true)

                        if (typeof data.crashPoint === "number") {
                            setCrashedPoint(data.crashPoint)
                            crashedPointRef.current = data.crashPoint
                            applyMultiplier(data.crashPoint)
                        }
                    }

                    onHistoryUpdateRef.current?.()
                    activeRoundIdRef.current = null
                    roundPhaseRef.current = "idle"
                    break
                }

                case "game_error":
                    console.error("Rocket game error:", data.message)
                    setIsRequestPending(false)
                    isRequestPendingRef.current = false
                    setIsFlying(false)
                    isFlyingRef.current = false
                    activeRoundIdRef.current = null
                    roundPhaseRef.current = "idle"
                    break

                default:
                    break
            }
        })

        return unsubscribe
    }, [
        subscribeWsMessage,
        resetRoundState,
        applyMultiplier,
        endRoundVisual,
        soundsRef,
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
                roundPhaseRef.current = "idle"
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
        roundPhaseRef.current = "running"
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
        roundPhaseRef.current = "idle"

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
            const currentMult = currentMultiplier
            const currentBet = betRef.current

            if (currentMult < 1) {
                setHasCashedOut(true)
                hasCashedOutRef.current = true
                setIsFlying(false)
                isFlyingRef.current = false
                setIsCrashed(true)
                roundPhaseRef.current = "idle"
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
            roundPhaseRef.current = "idle"
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
    }, [isCrashed, currentMultiplier, sendWsMessage, stopAnimation, betRef, demoModeRef, isFlyingRef, soundsRef])

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
