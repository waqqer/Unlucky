import { useState, useContext, useCallback, useRef, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import { SlotsApi } from "@/api/game"
import StatsApi from "@/api/statistics"
import ReelsContainer from "@/components/ReelsContainer"
import SlotReel from "@/components/SlotReel"
import BetInput from "@/components/BetInput"
import BetPresets from "@/components/BetPresets"
import Button from "@/components/Button"
import VictoryScreen from "@/widgets/VictoryScreen"
import styles from "./SlotMachineGame.module.css"

const SYMBOLS = ["🍒", "🍋", "🍇", "🍉", "🔔", "⭐", "💎", "7️⃣"]

const SlotMachineGame = (props) => {
    const {
        className,
        onGameComplete,
        onHistoryUpdate
    } = props

    const { account, updateUser } = useContext(AccountContext)
    const isMounted = useRef(true)
    const spinIntervalRef = useRef(null)

    const [reels, setReels] = useState(["🍒", "🍒", "🍒"])
    const [bet, setBet] = useState(10)
    const [isSpinning, setIsSpinning] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [enable, setEnable] = useState(true)

    // Очистка интервала при размонтировании
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current)
            }
        }
    }, [])

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

        setWinAmount(null)
        setEnable(false)

        try {
            const result = await SlotsApi.spin(account.name, bet)
            setIsSpinning(true)
            const win = result.winAmount || 0
            const newBalance = result.newBalance
            const combination = result.combination || ["🍒", "🍒", "🍒"]
            const multiplier = result.multiplier || 0

            // Обновляем баланс из ответа сервера
            if (newBalance !== undefined && isMounted.current) {
                updateUser({ balance: newBalance.toString() })
            }

            let spinIndex = 0
            const maxSpins = 20
            
            spinIntervalRef.current = setInterval(() => {
                if (!isMounted.current) {
                    clearInterval(spinIntervalRef.current)
                    return
                }
                
                setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()])
                spinIndex++

                if (spinIndex >= maxSpins) {
                    clearInterval(spinIntervalRef.current)
                    setReels(combination)
                    setWinAmount(win)

                    // История создаётся на бэкенде, статистику обновляем
                    if (win > 0) {
                        StatsApi.change(account.name, 1, 0, 1)
                        // Показываем экран победы
                        setShowVictory(true)
                        // Уведомляем о необходимости обновить историю
                        if (onHistoryUpdate) {
                            onHistoryUpdate()
                        }
                    } else {
                        StatsApi.change(account.name, 0, 1, 1)
                        // Уведомляем о необходимости обновить историю
                        if (onHistoryUpdate) {
                            onHistoryUpdate()
                        }
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
                    setEnable(true)
                }
            }, 100)

        } catch (error) {
            console.error("Ошибка при спине:", error)
            setIsSpinning(false)
            setEnable(true)
        }
    }, [bet, isSpinning, account, updateUser, onGameComplete, onHistoryUpdate])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    return (
        <div className={`${styles["slot-machine-game"]} ${className}`}>
            <VictoryScreen
                isOpen={showVictory}
                onClose={() => setShowVictory(false)}
                winAmount={winAmount}
            />

            <ReelsContainer className={styles["reels-container"]}>
                {reels.map((symbol, index) => (
                    <SlotReel
                        key={index}
                        symbol={symbol}
                        isSpinning={isSpinning}
                    />
                ))}
            </ReelsContainer>

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
                    isDisabled={!enable || bet < 1}
                >
                    {isSpinning ? "Крутим..." : "Сыграть"}
                </Button>
            </div>
        </div>
    )
}

export default SlotMachineGame
