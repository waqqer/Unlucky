import Button from "@/Components/Controlls/Buttons/Button"
import { memo, useCallback } from "react"
import styles from "./Presets.module.css"

interface UIPresetsProps {
    sets?: number[],
    onClick: (value: number) => void
}

const Presets = (props: UIPresetsProps) => {
    const {
        sets = [10, 25, 50, 100, 250],
        onClick
    } = props

    const handleClick = useCallback((value: number) => {
        if (onClick)
            onClick(value)
    }, [onClick])

    return (
        <div className={styles.presets}>
            {sets.map((v, i) => (
                <Button
                    key={i}
                    type="SECONDARY"
                    onClick={() => handleClick(v)}
                    className={styles.choice}
                >
                    {v}
                </Button>
            ))}
        </div>
    )
}

export default memo(Presets)