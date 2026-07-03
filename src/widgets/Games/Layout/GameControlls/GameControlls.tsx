import { memo } from "react"
import styles from "./GameControlls.module.css"
import Button from "@/Components/Controlls/Buttons/Button"
import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton"

interface UIGameControllsProps {
    openAbout: () => void
    onMenuClick?: () => void
}

const GameControlls = (props: UIGameControllsProps) => {
    const {
        openAbout,
        onMenuClick
    } = props

    return (
        <div className={styles.controlls}>
            <LinkedButton to="/" icon={false} type="SECONDARY" sound onClick={onMenuClick}>Меню</LinkedButton>
            <Button onClick={openAbout} sound>О игре</Button>
        </div>
    )
}

export default memo(GameControlls)
