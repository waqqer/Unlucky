import { memo, useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
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
    const sounds = useGameSounds(soundEnabled)

    const isMountedRef = useRef(true)
    const animationFrameRef = useRef(null)
    const hasCashedOutRef = useRef(false)
    const currentMultiplierRef = useRef(START_MULTIPLIER)

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
        }
    }, [stopAnimation])

    const handlePresetSelect = useCallback((preset) => {
        setBet(preset)
    }, [])

    const handleDemoToggle = useCallback(() => {
        setDemoMode(prev => !prev)
    }, [])

    const handleCloseVictory = useCallback(() => {
        setShowVictory(false)
    }, [])

    const applyBalanceAndHistory = useCallback((result) => {
        if (result && typeof result.balance === "number") {
            updateUser({ balance: result.balance.toString() })
        }
        if (onHistoryUpdate) onHistoryUpdate()
    }, [onHistoryUpdate, updateUser])

    const sendResult = useCallback((multiplier, isWin) => {
        const userUuid = accountRef.current?.UUID
        if (!userUuid) return

        RocketApi.result(userUuid, betRef.current, multiplier, isWin)
            .then(applyBalanceAndHistory)
            .catch(err => {
                console.error("Failed to send result:", err)
                if (onHistoryUpdate) onHistoryUpdate()
            })
    }, [applyBalanceAndHistory, onHistoryUpdate, accountRef, betRef])

    const resetRoundState = useCallback(() => {
        setHasCashedOut(false)
        hasCashedOutRef.current = false

        setIsCrashed(false)
        setCrashedPoint(null)
        crashedPointRef.current = null

        setWinAmount(null)
        setCurrentMultiplier(START_MULTIPLIER)
        currentMultiplierRef.current = START_MULTIPLIER
    }, [crashedPointRef])

    const startAnimation = useCallback((crashPoint) => {
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
                if (!demoModeRef.current) {
                    sendResult(crashedPointRef.current, false)
                }
            }
        }

        animationFrameRef.current = requestAnimationFrame(animate)
    }, [sendResult, demoModeRef])

    const startGame = useCallback(async () => {
        if (isRequestPendingRef.current || isFlyingRef.current) return
        if (!demoModeRef.current && !accountRef.current?.UUID) return

        const currentBalance = getBalance()
        const currentBet = betRef.current
        if (!demoModeRef.current && (
            currentBet < ROCKET_MIN_BET ||
            currentBet > ROCKET_MAX_BET ||
            currentBet > currentBalance
        )) {
            return
        }

        stopAnimation()

        setIsRequestPending(true)
        isRequestPendingRef.current = true
        resetRoundState()

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
                if (!result || typeof result.crashPoint !== "number") {
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

            soundsRef.current.playStart()
            startAnimation(crashPoint)
        } catch (error) {
            console.error("Rocket game error:", error)
            setIsRequestPending(false)
            isRequestPendingRef.current = false
            setIsFlying(false)
            isFlyingRef.current = false
        }
    }, [getBalance, resetRoundState, startAnimation, stopAnimation])

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

            stopAnimation()

            setWinAmount(0)
            soundsRef.current.playCrash()

            if (!demoModeRef.current) {
                if (accountRef.current?.UUID) {
                    sendResult(currentMult, false)
                }
            }
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

        if (!demoModeRef.current) {
            const userUuid = accountRef.current?.UUID
            if (!userUuid) {
                console.error("Cannot cash out: user UUID not found")
                return
            }

            sendResult(currentMult, true)

            setShowVictory(true)
        } else {
            setTimeout(() => {
                if (!isMountedRef.current) return
                setHasCashedOut(false)
                hasCashedOutRef.current = false
                setIsCrashed(false)
            }, 500)
        }
    }, [isCrashed, sendResult, stopAnimation])

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
                            isDisabled={isRequestPending || bet < ROCKET_MIN_BET || (!demoMode && !user) || showVictory}
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
                                ? `Забрать ${formatMoney(bet * currentMultiplier)} Ар`
                                : `Забрать ${formatMoney(bet * currentMultiplier)} Ар`
                            }
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
