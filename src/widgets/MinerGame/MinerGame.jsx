import { AccountContext } from "@/context/AccountContext"
import MinerField from "@/components/MinerField"
import { MINER_CONFIG } from "@/shared/configs"
import BetInput from "@/components/BetInput"
import { MinerApi } from "@/api/game"
import { useCallback, useState, useContext, useRef, useEffect } from "react"
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
        MINER_MIN_BET,
        COLS,
        ROWS
    } = MINER_CONFIG

    const { account, updateUser, user, refreshAccount } = useContext(AccountContext)

    const isMountedRef = useRef(true)

    const [isPlaying, setIsPlaying] = useState(false)
    const [bet, setBet] = useState(10)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [roundData, setRoundData] = useState(null)

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const play = useCallback(async () => {
        if (isRequestPending || isPlaying) return
        if (!account?.UUID) return

        setIsRequestPending(true)
        setIsPlaying(true)
        setShowVictory(false)
        setWinAmount(null)
        setRoundData(null)

        try {
            const result = await MinerApi.play(account.UUID, bet, COLS, ROWS)
            if (!isMountedRef.current) return

            setRoundData(result || {})

            const winFromServer = (result?.winAmount ?? result?.win ?? result?.payout ?? 0)
            const newBalance = result?.newBalance ?? result?.balance

            if (typeof newBalance === "number") {
                updateUser({ balance: newBalance.toString() })
            }

            const safeWin = Number(winFromServer) || 0
            setWinAmount(safeWin)
        } catch (error) {
            console.error("Miner game error:", error)
        } finally {
            if (!isMountedRef.current) return
            setIsRequestPending(false)
            setIsPlaying(false)
            refreshAccount?.()
        }
    }, [isRequestPending, isPlaying, account, bet, COLS, ROWS, updateUser, refreshAccount])

    const handleRoundComplete = useCallback(({ winAmount: completedWin } = {}) => {
        const safeWin = Number(completedWin ?? winAmount) || 0
        if (safeWin > 0) setShowVictory(true)
    }, [winAmount])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    const balance = parseFloat(account?.balance || 0)
    const hasEnoughBalance = bet <= balance
    const canPlay = !!user && !!account?.UUID && !isRequestPending && !isPlaying && bet >= MINER_MIN_BET && bet <= MINER_MAX_BET && hasEnoughBalance

    return (
        <>
            <div className={`${styles["miner-game"]} ${className}`}>

                <MinerField
                    soundEnabled={soundEnabled}
                    roundData={roundData}
                    isPlaying={isPlaying}
                    onRoundComplete={handleRoundComplete}
                />

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