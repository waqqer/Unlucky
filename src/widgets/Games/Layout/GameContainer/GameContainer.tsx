import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import GameHistory from "../GameHistory"
import type { Parent } from "@/Shared/Types/PropsTypes"
import styles from "./GameContainer.module.css"
import Input from "@/Components/Controlls/Inputs/Input"
import Separator from "@/Components/Decorations/Separator"
import Button from "@/Components/Controlls/Buttons/Button"
import Check from "@/Components/Controlls/Inputs/Check"
import Presets from "../Presets"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"
import useStateMachine, { type StateMachineData } from "@/Hooks/useStateMachine"
import VictoryScreen from "../../Animations/VictoryScreen"

interface UIGameContainerProps extends Parent {
    type?: "double" | "triple"
    demo?: boolean
    autoreroll?: boolean
    onPlay?: (bet: number) => void
}

type GameState = "IDLE" | "PLAYING" | "WIN"

export interface GameContainerRef {
    bet: number
    isDemo: boolean
    isAutoreroll: boolean
    StateMachine: StateMachineData<GameState>
    setWinAmount: (value: number) => void
}

const GameContainer = forwardRef<GameContainerRef, UIGameContainerProps>((props, ref) => {
    const {
        type = "double",
        children,
        demo = true,
        autoreroll = true,
        onPlay
    } = props

    const [bet, setBet] = useState<string>("25")
    const [isAutoreroll, setIsAutoreroll] = useState<boolean>(false)
    const [isDemo, setIsDemo] = useState<boolean>(false)
    const [winAmount, setWinAmount] = useState<number>(0)
    const betRef = useRef(bet)
    const isAutorerollRef = useRef(isAutoreroll)
    const isDemoRef = useRef(isDemo)
    const stateMachineRef = useRef<StateMachineData<GameState> | null>(null)
    const autorerollTimerRef = useRef<number | null>(null)

    const { balance } = useContext(AccountContext)
    const { isAuth } = useContext(AuthContext)

    const stateChangeHandler = useCallback((state: GameState) => {
        console.log(state)
    }, [])

    const StateMachine = useStateMachine<GameState>("IDLE", {
        onChange: stateChangeHandler
    })

    useEffect(() => {
        betRef.current = bet
        isAutorerollRef.current = isAutoreroll
        isDemoRef.current = isDemo
        stateMachineRef.current = StateMachine
    }, [bet, isAutoreroll, isDemo, StateMachine])

    useEffect(() => {
        return () => {
            if (autorerollTimerRef.current) {
                window.clearTimeout(autorerollTimerRef.current)
            }
        }
    }, [])

    useImperativeHandle(ref, () => ({
        get bet() {
            return Number(betRef.current)
        },
        get isAutoreroll() {
            return isAutorerollRef.current
        },
        get isDemo() {
            return isDemoRef.current
        },
        get StateMachine() {
            return stateMachineRef.current || StateMachine
        },
        setWinAmount
    }), [StateMachine])

    const choosePresetHandle = useCallback((value: number) => {
        setBet(String(value))
    }, [])

    const onBetInputChange = useCallback((v: string) => {
        setBet(v)
    }, [])

    const onPlayHandle = useCallback(() => {
        onPlay?.(Number(bet))
    }, [bet, onPlay])

    const buttonDisabled: boolean = useMemo((): boolean => {
        if (!StateMachine.is("IDLE"))
            return true

        if (isDemo)
            return false

        return Number(bet) > balance || !isAuth
    }, [bet, balance, isDemo, isAuth, StateMachine])

    const onWinScreenEnd = useCallback(() => {
        StateMachine.changeState("IDLE")

        if (!isAutorerollRef.current || isDemoRef.current) return

        if (autorerollTimerRef.current) {
            window.clearTimeout(autorerollTimerRef.current)
        }

        autorerollTimerRef.current = window.setTimeout(() => {
            autorerollTimerRef.current = null
            if (!isAutorerollRef.current || isDemoRef.current) return
            onPlay?.(Number(betRef.current))
        }, 420)
    }, [StateMachine, onPlay])

    return (
        <>
            <VictoryScreen isActive={StateMachine.is("WIN")} win={winAmount} onEnd={onWinScreenEnd} />
            <div className={`${styles["game-box"]} ${styles[type]}`}>
                <GameHistory />

                {type === "double" ?
                    <div className={styles["d-box"]}>
                        <div className={styles.game}>
                            {children}
                        </div>

                        <div className={styles.input}>
                            <h2>Ставка</h2>
                            <Separator size={50} />
                            <Input type="number" value={bet} min={0} max={isAuth ? balance : 1000} onChange={onBetInputChange} className={styles["bet-input"]}/>
                            <Presets onClick={choosePresetHandle} />

                            {autoreroll && <Check onChange={(value) => setIsAutoreroll(value)} checked={isAutoreroll && !isDemo} isDisabled={isDemo}>Авто-реролл</Check>}
                            {demo && <Check onChange={(value) => {
                                if (value) {
                                    setIsAutoreroll(false)
                                }
                                setIsDemo(value)
                            }} checked={isDemo}>Демо</Check>}

                            <Button className={
                                styles["play-btn"]}
                                isDisabled={buttonDisabled}
                                onClick={onPlayHandle}
                            >
                                Играть
                            </Button>
                        </div>
                    </div>
                    :
                    <>
                        <div className={styles.game}>
                            {children}
                        </div>

                        <div className={styles.input}>
                            <h2>Ставка</h2>
                            <Separator size={100} />
                            <Input type="number" value={bet} min={0} max={isAuth ? balance : 1000} onChange={onBetInputChange} className={styles["bet-input"]}/>
                            <Presets className={styles["t-presets"]} onClick={choosePresetHandle} />

                            {autoreroll && <Check onChange={(value) => setIsAutoreroll(value)} checked={isAutoreroll && !isDemo} isDisabled={isDemo}>Авто-реролл</Check>}
                            {demo && <Check onChange={(value) => {
                                if (value) {
                                    setIsAutoreroll(false)
                                }
                                setIsDemo(value)
                            }} checked={isDemo}>Демо</Check>}

                            <Button
                                className={styles["play-btn"]}
                                isDisabled={buttonDisabled}
                                onClick={onPlayHandle}
                            >
                                Играть
                            </Button>
                        </div>
                    </>
                }
            </div>
        </>
    )
})

export default memo(GameContainer)
