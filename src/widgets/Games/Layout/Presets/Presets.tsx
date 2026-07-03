import Button from "@/Components/Controlls/Buttons/Button"
import { memo, useCallback, useContext } from "react"
import styles from "./Presets.module.css"
import { AccountContext } from "@/Context/AccountContext"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface UIPresetsProps extends Classable {
    sets?: number[],
    onClick: (value: number) => void
}

const Presets = (props: UIPresetsProps) => {
    const {
        sets = [10, 25, 50, 100, 250],
        onClick,
        className = ""
    } = props

    const { balance } = useContext(AccountContext)

    const handleClick = useCallback((value: number) => {
        if (onClick)
            onClick(value)
    }, [onClick])

    return (
        <div className={`${styles.presets} ${className}`}>
            {sets.map((v, i) => {
                return (
                    <Button
                        key={i}
                        type="SECONDARY"
                        onClick={() => handleClick(v)}
                        className={styles.choice}
                        isDisabled={balance < v}
                    >
                        {v}
                    </Button>
                )
            })}
        </div>
    )
}

export default memo(Presets)