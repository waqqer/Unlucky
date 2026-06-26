import { forwardRef, memo, useCallback, useContext, useImperativeHandle, useMemo, useState } from "react"
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
}

type GameState = "IDLE" | "PLAYING" | "WIN" | "WAITING"

export interface GameContainerRef {
    bet: number
    isDemo: boolean
    isAutoreroll: boolean
    StateMachine: StateMachineData<GameState>
}

const GameContainer = forwardRef<GameContainerRef, UIGameContainerProps>((props, ref) => {
    const {
        type = "double",
        children,
        demo = true,
        autoreroll = true
    } = props

    const [bet, setBet] = useState<number>(25)
    const [isAutoreroll, setIsAutoreroll] = useState<boolean>(false)
    const [isDemo, setIsDemo] = useState<boolean>(false)

    const { balance } = useContext(AccountContext)
    const { isAuth } = useContext(AuthContext)

    const stateChangeHandler = useCallback((state: GameState) => {
        console.log(state)
    }, [])

    const StateMachine = useStateMachine<GameState>("IDLE", {
        onChange: stateChangeHandler
    })

    useImperativeHandle(ref, () => ({
        bet: bet,
        isAutoreroll,
        isDemo,
        StateMachine
    }))

    const choosePresetHandle = useCallback((value: number) => {
        setBet(value)
    }, [])

    const onBetInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setBet(Number(ev.target.value))
    }, [])

    const buttonDisabled: boolean = useMemo((): boolean => {
        if (!StateMachine.is("IDLE"))
            return true

        if (isDemo)
            return false

        return bet > balance || !isAuth
    }, [bet, balance, isDemo, isAuth, StateMachine])

    const onWinScreenEnd = useCallback(() => {
        StateMachine.changeState("IDLE")
    }, [StateMachine])

    return (
        <>
            <VictoryScreen isActive={StateMachine.is("WIN")} win={100} onEnd={onWinScreenEnd}/>
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
                            <Input type="number" value={bet} min={0} max={balance} onChange={onBetInputChange} />
                            <Presets onClick={choosePresetHandle} />

                            {autoreroll && <Check onChange={(value) => setIsAutoreroll(value)} checked={isAutoreroll}>Авто-реролл</Check>}
                            {demo && <Check onChange={(value) => setIsDemo(value)} checked={isDemo}>Демо</Check>}

                            <Button className={
                                styles["play-btn"]}
                                isDisabled={buttonDisabled}
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
                            <Input type="number" value={bet} min={0} max={balance} onChange={onBetInputChange} />
                            <Presets onClick={choosePresetHandle} />

                            {autoreroll && <Check onChange={(value) => setIsAutoreroll(value)} checked={isAutoreroll}>Авто-реролл</Check>}
                            {demo && <Check onChange={(value) => setIsDemo(value)} checked={isDemo}>Демо</Check>}

                            <Button
                                className={styles["play-btn"]}
                                isDisabled={buttonDisabled}
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