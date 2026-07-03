import { memo } from "react"
import styles from "./GameControlls.module.css"
import Button from "@/Components/Controlls/Buttons/Button"
import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton"
import type { GameContainerRef } from "../GameContainer"

interface UIGameControllsProps {
    openAbout: () => void
    onMenuClick?: () => void
    isMenuDisabled?: boolean
    data?: GameContainerRef
}

const GameControlls = (props: UIGameControllsProps) => {
    const {
        openAbout,
        onMenuClick,
        isMenuDisabled,
        data
    } = props

    const menuDisabled = isMenuDisabled ?? (data ? !data.StateMachine.is("IDLE") : false)

    return (
        <div className={styles.controlls}>
            <LinkedButton
                to="/"
                icon={false}
                type="SECONDARY"
                sound
                onClick={onMenuClick}
                isDisabled={menuDisabled}
            >
                Меню
            </LinkedButton>
            <Button onClick={openAbout} sound>О игре</Button>
        </div>
    )
}

export default memo(GameControlls)
