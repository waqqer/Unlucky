import { AccountContext } from "@/context/AccountContext"
import MinerField from "@/components/MinerField"
import { MINER_CONFIG } from "@/shared/configs"
import BetInput from "@/components/BetInput"
import { useCallback, useState, useContext } from "react"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import styles from "./MinerGame.module.css"

const MinerGame = (props) => {
    const {
        className = "",
        soundEnabled = true
    } = props

    const {
        MINER_MAX_BET,
        MINER_BET_PRESETS,
        MINER_MIN_BET
    } = MINER_CONFIG

    const { account, updateUser, user } = useContext(AccountContext)

    const [isPlaying, setIsPlaying] = useState(false)
    const [bet, setBet] = useState(10)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)

    const play = useCallback(() => {

    }, [])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    const balance = parseFloat(account?.balance || 0)
    const hasEnoughBalance = bet <= balance
    const canPlay = !user && !isPlaying && bet >= MINER_MIN_BET && hasEnoughBalance

    return (
        <>
            <div className={`${styles["miner-game"]} ${className}`}>

                <MinerField soundEnabled={soundEnabled} />

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <img 
                            src="https://media.tenor.com/Mdz2s-fOMggAAAAj/the-fragrant-flower-blooms-with-dignity-kaoruko-waguri.gif" 
                            alt="dance gif" 
                            className="mobile-hide"
                            draggable={false}
                            loading="lazy"
                        />

                        <BetInput
                            value={bet}
                            onChange={setBet}
                            disabled={isRequestPending || isPlaying}
                            min={MINER_MIN_BET}
                            max={MINER_MAX_BET}
                        />
                        <BetPresets
                            className="sp-hide"
                            onSelect={handlePresetSelect}
                            disabled={isRequestPending || isPlaying}
                            presets={MINER_BET_PRESETS}
                        />

                        <Button
                            className={styles["spin-btn"]}
                            onClick={play}
                            isDisabled={!canPlay}
                            activateOnSpace={true}
                            title={!hasEnoughBalance ? "Недостаточно средств" : undefined}
                        >
                            {isPlaying ? "Играем..." : "Сыграть"}
                        </Button>
                    </div>
                </div>
            </div>

            <VictoryScreen
                isOpen={showVictory}
                onClose={() => setShowVictory(false)}
                winAmount={winAmount}
            />
        </>
    )
}

export default MinerGame