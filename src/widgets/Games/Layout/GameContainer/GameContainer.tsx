import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from "react"
import GameHistory from "../GameHistory"
import type { Parent } from "@/Shared/Types/PropsTypes"
import styles from "./GameContainer.module.css"
import Input from "@/Components/Controlls/Inputs/Input"
import Separator from "@/Components/Decorations/Separator"
import Button from "@/Components/Controlls/Buttons/Button"
import Check from "@/Components/Controlls/Inputs/Check"
import Presets from "../Presets"

interface UIGameContainerProps extends Parent {
    type?: "double" | "triple"
    demo?: boolean
    autoreroll?: boolean
}

export interface UIGameContainerRef {
    bet: number
    isDemo: boolean
    isAutoreroll: boolean
} 

const GameContainer = forwardRef<UIGameContainerRef, UIGameContainerProps>((props, ref) => {
    const {
        type = "double",
        children,
        demo = true,
        autoreroll = true
    } = props

    const [bet, setBet] = useState<number>(25)
    const [isAutoreroll, setIsAutoreroll] = useState<boolean>(false)
    const [isDemo, setIsDemo] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
        bet: bet,
        isAutoreroll,
        isDemo
    }))

    const choosePresetHandle = useCallback((value: number) => {
        setBet(value)
    }, [])

    const onBetInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setBet(Number(ev.target.value))
    }, [])

    return (
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
                        <Input type="number" value={bet} min={0} max={1000} onChange={onBetInputChange}/>
                        <Presets onClick={choosePresetHandle} />

                        {autoreroll && <Check>Авто-реролл</Check>}
                        {demo && <Check>Демо</Check>}

                        <Button className={styles["play-btn"]}>Играть</Button>
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
                        <Input type="number" value={bet} min={0} max={1000} onChange={onBetInputChange} />
                        <Presets onClick={choosePresetHandle} />

                        {autoreroll && <Check>Авто-реролл</Check>}
                        {demo && <Check>Демо</Check>}

                        <Button className={styles["play-btn"]}>Играть</Button>
                    </div>
                </>
            }
        </div>
    )
})

export default memo(GameContainer)