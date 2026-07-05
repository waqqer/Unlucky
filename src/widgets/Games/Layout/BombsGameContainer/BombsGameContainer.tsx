import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import Button from "@/Components/Controlls/Buttons/Button"
import Input from "@/Components/Controlls/Inputs/Input"
import Check from "@/Components/Controlls/Inputs/Check"
import Separator from "@/Components/Decorations/Separator"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"
import useStateMachine, { type StateMachineData } from "@/Hooks/useStateMachine"
import type { Parent } from "@/Shared/Types/PropsTypes"
import VictoryScreen from "../../Animations/VictoryScreen"
import GameHistory from "../GameHistory"
import styles from "./BombsGameContainer.module.css"
import type { GameTitle } from "@/Api/History"
import useGameHistory from "@/Hooks/useGameHistory"
import Presets from "../Presets"

export type BombsGameState = "IDLE" | "PLAYING" | "WIN"

interface UIBombsGameContainerProps extends Parent {
    onPlay?: (bet: number) => void
    onCashout?: () => void
    isActionPending?: boolean
    onStateChange?: (state: BombsGameState) => void
    gameName: GameTitle
}

export interface BombsGameContainerRef {
    bet: number
    isDemo: boolean
    StateMachine: StateMachineData<BombsGameState>
    setWinAmount: (value: number) => void
    pushHistory: (amount: number) => void
}

const BombsGameContainer = forwardRef<BombsGameContainerRef, UIBombsGameContainerProps>((props, ref) => {
    const {
        children,
        onPlay,
        onCashout,
        isActionPending = false,
        onStateChange,
        gameName
    } = props

    const [bet, setBet] = useState("25")
    const [isDemo, setIsDemo] = useState(false)
    const [winAmount, setWinAmount] = useState(0)
    const betRef = useRef(bet)
    const isDemoRef = useRef(isDemo)
    const stateMachineRef = useRef<StateMachineData<BombsGameState> | null>(null)

    const { balance } = useContext(AccountContext)
    const { isAuth } = useContext(AuthContext)
    const {
        history,
        isHistoryLoading,
        historyError,
        freshHistoryKey,
        pushHistory
    } = useGameHistory(gameName)

    const stateChangeHandler = useCallback((state: BombsGameState) => {
        onStateChange?.(state)
    }, [onStateChange])

    const StateMachine = useStateMachine<BombsGameState>("IDLE", {
        onChange: stateChangeHandler
    })

    useEffect(() => {
        betRef.current = bet
        isDemoRef.current = isDemo
        stateMachineRef.current = StateMachine
    }, [bet, isDemo, StateMachine])

    useImperativeHandle(ref, () => ({
        get bet() {
            return Number(betRef.current)
        },
        get isDemo() {
            return isDemoRef.current
        },
        get StateMachine() {
            return stateMachineRef.current || StateMachine
        },
        setWinAmount,
        pushHistory
    }), [StateMachine, pushHistory])

    const isPlaying = StateMachine.is("PLAYING")
    const buttonText = isPlaying ? "Забрать" : "Играть"

    const buttonDisabled = useMemo(() => {
        if (isPlaying) return isActionPending
        if (!StateMachine.is("IDLE")) return true
        if (Number(bet) <= 0) return true
        if (isDemo) return false
        return Number(bet) > balance || !isAuth
    }, [StateMachine, balance, bet, isActionPending, isAuth, isDemo, isPlaying])

    const handleMainButton = useCallback(() => {
        if (isPlaying) {
            onCashout?.()
            return
        }

        onPlay?.(Number(bet))
    }, [bet, isPlaying, onCashout, onPlay])

    const handleVictoryEnd = useCallback(() => {
        StateMachine.changeState("IDLE")
    }, [StateMachine])

    return (
        <>
            <VictoryScreen isActive={StateMachine.is("WIN") && !isDemo} win={winAmount - Number(bet)} onEnd={handleVictoryEnd} />
            <div className={styles["game-box"]}>
                <GameHistory items={history} freshKey={freshHistoryKey} isLoading={isHistoryLoading} error={historyError} />

                <div className={styles.game}>
                    {children}
                </div>

                <div className={styles.input}>
                    <h2>Ставка</h2>
                    <Separator size={100} />
                    <Input
                        type="number"
                        value={bet}
                        min={0}
                        max={isAuth ? Math.min(1000, balance) : 1000}
                        onChange={(value) => {
                            if (!isPlaying) setBet(value)
                        }}
                        className={styles["bet-input"]}
                    />

                    <Presets
                        onClick={(v) => setBet(String(v))}
                        sets={[10, 25, 50, 100]}
                        balanceDependent={false}
                        className={styles.presets}
                    />

                    <Check onChange={setIsDemo} checked={isDemo} isDisabled={isPlaying}>Демо</Check>

                    <Button
                        className={`${styles["play-btn"]} ${isPlaying ? styles.cashout : ""}`}
                        isDisabled={buttonDisabled}
                        onClick={handleMainButton}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </>
    )
})

export default memo(BombsGameContainer)
