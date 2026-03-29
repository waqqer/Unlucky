import { useState, useContext, useCallback } from "react"
import { AccountContext } from "@/context/AccountContext"
import { SlotsApi } from "@/api/game"
import StatsApi from "@/api/statistics"
import ReelsContainer from "@/components/ReelsContainer"
import SlotReel from "@/components/SlotReel"
import BetInput from "@/components/BetInput"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import WinDisplay from "@/components/WinDisplay"
import styles from "./SlotMachineGame.module.css"

const SYMBOLS = ["🍒", "🍋", "🍇", "🍉", "🔔", "⭐", "💎", "7️⃣"]

const SlotMachineGame = (props) => {
    const {
        className,
        onGameComplete
    } = props

    const { user, account, updateUser } = useContext(AccountContext)
    const [reels, setReels] = useState(["🍒", "🍒", "🍒"])
    const [bet, setBet] = useState(10)
    const [isSpinning, setIsSpinning] = useState(false)
    const [winAmount, setWinAmount] = useState(null)

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

    const spin = useCallback(async () => {
        if (isSpinning || !account?.name) {
            console.warn("Spin blocked:", { isSpinning, hasUserName: !!account?.name })
            return
        }

        const currentBalance = parseFloat(account.balance || 0)
        if (bet <= 0 || bet > currentBalance) {
            console.warn("Недостаточно средств или неверная ставка", { bet, currentBalance })
            return
        }

        setIsSpinning(true)
        setWinAmount(null)

        try {
            // Бэкенд сам снимает ставку и начисляет выигрыш
            const result = await SlotsApi.spin(account.name, bet)
            const win = result.winAmount || 0
            const newBalance = result.newBalance
            const combination = result.combination || ["🍒", "🍒", "🍒"]
            const multiplier = result.multiplier || 0

            // Обновляем баланс из ответа сервера
            if (newBalance !== undefined) {
                updateUser({ balance: newBalance.toString() })
            }

            let spinIndex = 0
            const maxSpins = 20
            const spinInterval = setInterval(() => {
                setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()])
                spinIndex++

                if (spinIndex >= maxSpins) {
                    clearInterval(spinInterval)
                    setReels(combination)
                    setWinAmount(win)

                    // История создаётся на бэкенде, статистику обновляем
                    if (win > 0) {
                        StatsApi.change(account.name, 1, 0, 1)
                    } else {
                        StatsApi.change(account.name, 0, 1, 1)
                    }

                    if (onGameComplete) {
                        onGameComplete({
                            combination,
                            multiplier,
                            win,
                            bet
                        })
                    }

                    setIsSpinning(false)
                }
            }, 100)

        } catch (error) {
            console.error("Ошибка при спине:", error)
            setIsSpinning(false)
        }
    }, [bet, isSpinning, account, updateUser, onGameComplete])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    return (
        <div className={`${styles["slot-machine-game"]} ${className}`}>
            <ReelsContainer className={styles["reels-container"]}>
                {reels.map((symbol, index) => (
                    <SlotReel
                        key={index}
                        symbol={symbol}
                        isSpinning={isSpinning}
                    />
                ))}
            </ReelsContainer>

            {winAmount !== null && winAmount > 0 && (
                <WinDisplay amount={winAmount} />
            )}

            <div className={styles["controls-section"]}>
                <div className={styles["bet-section"]}>
                    <BetInput
                        value={bet}
                        onChange={setBet}
                        disabled={isSpinning}
                        min={1}
                        max={10000}
                    />
                    <BetPresets
                        onSelect={handlePresetSelect}
                        disabled={isSpinning}
                        presets={[10, 50, 100, 500, 1000]}
                    />
                </div>

                <Button
                    className={styles["spin-btn"]}
                    onClick={spin}
                    isDisabled={isSpinning || bet <= 0}
                >
                    {isSpinning ? "Крутим..." : "Сыграть"}
                </Button>
            </div>
        </div>
    )
}

export default SlotMachineGame
