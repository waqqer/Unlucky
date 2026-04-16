import { AccountContext } from "@/context/AccountContext"
import { useContext, useState, useCallback } from "react"
import Button from "@/components/Button"
import styles from "./MinerGame.module.css"

const MinerGame = (props) => {
    const {
        className = "",
        onHistoryUpdate,
        soundEnabled = true
    } = props

    const [bet, setBet] = useState(10)
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePresetSelect = useCallback((preset) => {
        setBet(preset)
    }, [])

    const { account, updateUser, getBalance, user } = useContext(AccountContext)


    return (
        <>
            <div className={`${styles["miner-game"]} ${className}`}>
                <div className={styles["game-area"]}>

                </div>

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <BetInput
                            value={bet}
                            onChange={setBet}
                            disabled={isPlaying}
                            min={ROCKET_MIN_BET}
                            max={ROCKET_MAX_BET}
                        />
                        <BetPresets
                            className="sp-hide"
                            onSelect={handlePresetSelect}
                            disabled={isPlaying}
                            presets={ROCKET_BET_PRESETS}
                        />
                    </div>

                    <Button>

                    </Button>
                </div>
            </div>
        </>
    )
}