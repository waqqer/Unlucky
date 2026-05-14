import { AccountContext } from "@/context/AccountContext"
import MinerField from "@/components/MinerField"
import { MINER_CONFIG } from "@/shared/configs"
import BetInput from "@/components/BetInput"
import { MinerApi } from "@/api/game"
import { memo, useCallback, useState, useContext, useRef, useEffect } from "react"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import styles from "./MinerGame.module.css"

const MinerGame = (props) => {
    const {
        className = "",
        soundEnabled = true,
        onHistoryUpdate,
        onAnimationComplete
    } = props

    const {
        MINER_MAX_BET,
        MINER_BET_PRESETS,
        MINER_MIN_BET,
        COLS,
        ROWS,
        PICKAXE_ROWS
    } = MINER_CONFIG

    const { account, updateUser, user, refreshAccount } = useContext(AccountContext)

    const isMountedRef = useRef(true)
    const pendingBalanceRef = useRef(null)

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
            const result = await MinerApi.play(account.UUID, bet, COLS, ROWS, PICKAXE_ROWS)
            if (!isMountedRef.current) return

            setRoundData(result || {})

            const winFromServer = (result?.winAmount ?? result?.win ?? result?.payout ?? 0)
            const newBalance = result?.newBalance ?? result?.balance

            if (typeof newBalance === "number") {
                pendingBalanceRef.current = newBalance
            } else {
                pendingBalanceRef.current = null
            }

            const safeWin = Number(winFromServer) || 0
            setWinAmount(safeWin)
        } catch (error) {
            console.error("Miner game error:", error)
            pendingBalanceRef.current = null
            if (isMountedRef.current) setIsPlaying(false)
        } finally {
            if (isMountedRef.current) {
                setIsRequestPending(false)
            }
        }
    }, [isRequestPending, isPlaying, account, bet, COLS, ROWS, PICKAXE_ROWS])

    const handleAnimationComplete = useCallback(() => {
        setIsPlaying(false)
        const bal = pendingBalanceRef.current
        pendingBalanceRef.current = null
        if (typeof bal === "number") {
            updateUser({ balance: bal.toString() })
        }
        refreshAccount?.()
        onHistoryUpdate?.()
        onAnimationComplete?.()
    }, [onHistoryUpdate, onAnimationComplete, updateUser, refreshAccount])

    const handleRoundComplete = useCallback(({ winAmount: completedWin } = {}) => {
        const safeWin = Number(completedWin) || 0
        if (safeWin > 0) setShowVictory(true)
    }, [])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    const handleCloseVictory = useCallback(() => {
        setShowVictory(false)
    }, [])

    const balance = parseFloat(account?.balance || 0)
    const hasEnoughBalance = bet <= balance
    const canPlay = !!user && !!account?.UUID && !isRequestPending && !isPlaying && bet >= MINER_MIN_BET && bet <= MINER_MAX_BET && hasEnoughBalance && !showVictory

    return (
        <>
            <div className={`${styles["miner-game"]} ${className}`}>

                <MinerField
                    soundEnabled={soundEnabled}
                    roundData={roundData}
                    isPlaying={isPlaying}
                    onRoundComplete={handleRoundComplete}
                    onAnimationComplete={handleAnimationComplete}
                />

                <div className={styles["controls-section"]}>
                    <div className={styles["bet-section"]}>
                        <img
                            className={`${styles.gif} mobile-hide`}
                            src="https://media.tenor.com/MhX9j6cmTkAAAAAi/minecraft-discord.gif"
                            alt="dance gif"
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
                onClose={handleCloseVictory}
                winAmount={winAmount}
            />
        </>
    )
}

export default memo(MinerGame)