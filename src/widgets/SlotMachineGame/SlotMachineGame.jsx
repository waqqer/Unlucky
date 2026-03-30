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
import AutoReroll from "@/components/AutoReroll"
import slotSound from "@/shared/audio/slot.mp3"
import styles from "./SlotMachineGame.module.css"

const SYMBOLS = ["coal", "iron", "gold", "diamond"]

const SlotMachineGame = (props) => {
    const {
        className,
        onGameComplete,
        onHistoryUpdate
    } = props

    const { account, updateUser } = useContext(AccountContext)
    const isMounted = useRef(true)
    const spinIntervalRef = useRef(null)
    const autoRerollTimeoutRef = useRef(null)
    const audioRef = useRef(null)
    const autoRerollEnabledRef = useRef(false)

    const [reels, setReels] = useState(["coal", "coal", "coal"])
    const [bet, setBet] = useState(8)
    const [isSpinning, setIsSpinning] = useState(false)
    const [isRequestPending, setIsRequestPending] = useState(false)
    const [winAmount, setWinAmount] = useState(null)
    const [showVictory, setShowVictory] = useState(false)
    const [stoppedReels, setStoppedReels] = useState([false, false, false])

    // Авто-реролл состояния
    const [autoRerollEnabled, setAutoRerollEnabled] = useState(false)
    const [consecutiveLosses, setConsecutiveLosses] = useState(0)

    // Синхронизация ref с состоянием
    useEffect(() => {
        autoRerollEnabledRef.current = autoRerollEnabled
    }, [autoRerollEnabled])

    // Очистка всех интервалов и таймаутов при размонтировании
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current)
            }
            if (autoRerollTimeoutRef.current) {
                clearTimeout(autoRerollTimeoutRef.current)
            }
        }
    }, [])

    // Обработчик изменения настроек авто-рерола
    const handleAutoRerollToggle = useCallback(() => {
        setAutoRerollEnabled(prev => {
            const newValue = !prev
            if (!newValue) {
                // При выключении очищаем таймаут
                if (autoRerollTimeoutRef.current) {
                    clearTimeout(autoRerollTimeoutRef.current)
                    autoRerollTimeoutRef.current = null
                }
            }
            return newValue
        })
        setConsecutiveLosses(0)
    }, [])

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

    const spin = useCallback(async () => {
        // Блокировка во время запроса или анимации
        if (isRequestPending || isSpinning || !account?.name) {
            console.warn("Spin blocked:", { isRequestPending, isSpinning, hasUserName: !!account?.name })
            return
        }

        const currentBalance = parseFloat(account.balance || 0)
        if (bet <= 0 || bet > currentBalance) {
            console.warn("Недостаточно средств или неверная ставка", { bet, currentBalance })
            setAutoRerollEnabled(false)
            return
        }

        setWinAmount(null)
        setIsRequestPending(true)
        setStoppedReels([false, false, false])

        try {
            // Сначала запрос к серверу
            const result = await SlotsApi.spin(account.name, bet)
            const win = result.winAmount || 0
            const newBalance = result.newBalance
            // Бэкенд возвращает combination как массив строк: ["diamond", "gold", "iron"]
            const combination = result.combination || ["coal", "coal", "coal"]
            const multiplier = result.multiplier || 0

            // Обновляем баланс из ответа сервера
            if (newBalance !== undefined && isMounted.current) {
                updateUser({ balance: newBalance.toString() })
            }

            // Теперь запускаем анимацию
            setIsSpinning(true)

            // Запускаем звук
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.loop = true
                audioRef.current.playbackRate = 1.2
                audioRef.current.play().catch(err => console.warn("Audio play failed:", err))
            }

            let spinIndex = 0
            const maxSpins = 20
            const reelDelays = [0, 8, 15] // Задержка остановки для каждого барабана (в кадрах после maxSpins)

            spinIntervalRef.current = setInterval(() => {
                if (!isMounted.current) {
                    clearInterval(spinIntervalRef.current)
                    return
                }

                spinIndex++

                // Проверяем, нужно ли остановить какой-то барабан
                const newReels = [...reels]
                const newStoppedReels = [...stoppedReels]

                for (let i = 0; i < 3; i++) {
                    if (!newStoppedReels[i] && spinIndex >= maxSpins + reelDelays[i]) {
                        newReels[i] = combination[i]
                        newStoppedReels[i] = true
                    } else if (!newStoppedReels[i]) {
                        newReels[i] = getRandomSymbol()
                    }
                }

                setReels(newReels)
                setStoppedReels(newStoppedReels)

                // Все барабаны остановились
                if (newStoppedReels.every(stopped => stopped)) {
                    clearInterval(spinIntervalRef.current)
                    setWinAmount(win)
                    setIsSpinning(false)
                    setIsRequestPending(false)

                    // Останавливаем звук
                    if (audioRef.current) {
                        audioRef.current.pause()
                        audioRef.current.currentTime = 0
                    }

                    // Обработка результата
                    const isWin = win > 0

                    if (isWin) {
                        StatsApi.change(account.name, 1, 0, 1)
                        setShowVictory(true)
                        setConsecutiveLosses(0)
                    } else {
                        StatsApi.change(account.name, 0, 1, 1)
                        const newConsecutiveLosses = consecutiveLosses + 1
                        setConsecutiveLosses(newConsecutiveLosses)
                    }

                    // Уведомляем о необходимости обновить историю
                    if (onHistoryUpdate) {
                        onHistoryUpdate()
                    }

                    if (onGameComplete) {
                        onGameComplete({
                            combination,
                            multiplier,
                            win,
                            bet
                        })
                    }

                    // Авто-реролл: следующая игра через небольшую задержку
                    if (autoRerollEnabledRef.current && isMounted.current) {
                        const nextBalance = parseFloat(newBalance || account.balance || 0)
                        if (nextBalance >= bet) {
                            autoRerollTimeoutRef.current = setTimeout(() => {
                                // Проверяем через ref, что авто-реролл всё ещё включён
                                if (isMounted.current && autoRerollEnabledRef.current) {
                                    spin()
                                }
                            }, 500)
                        } else {
                            setAutoRerollEnabled(false)
                        }
                    }
                }
            }, 100)

        } catch (error) {
            console.error("Ошибка при спине:", error)
            setIsSpinning(false)
            setIsRequestPending(false)
            setAutoRerollEnabled(false)
        }
    }, [bet, isSpinning, isRequestPending, account, updateUser, onGameComplete, onHistoryUpdate, autoRerollEnabled, consecutiveLosses, reels, stoppedReels])

    const handlePresetSelect = (preset) => {
        setBet(preset)
    }

    return (
        <div className={`${styles["slot-machine-game"]} ${className}`}>
            <audio ref={audioRef} src={slotSound} preload="auto"/>

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
                        isSpinning={isSpinning && !stoppedReels[index]}
                        isStopped={stoppedReels[index]}
                    />
                ))}
            </ReelsContainer>

            <div className={styles["controls-section"]}>
                <div className={styles["bet-section"]}>
                    <BetInput
                        value={bet}
                        onChange={setBet}
                        disabled={isRequestPending || isSpinning}
                        min={1}
                        max={10000}
                    />
                    <BetPresets
                        onSelect={handlePresetSelect}
                        disabled={isRequestPending || isSpinning}
                        presets={[8, 16, 32, 64, 128]}
                    />
                </div>

                <AutoReroll
                    enabled={autoRerollEnabled}
                    onToggle={handleAutoRerollToggle}
                />

                <Button
                    className={styles["spin-btn"]}
                    onClick={spin}
                    isDisabled={isRequestPending || isSpinning || bet < 1}
                    activateOnSpace={true}
                >
                    {isSpinning ? "Крутим..." : "Сыграть"}
                </Button>
            </div>
        </div>
    )
}

export default SlotMachineGame
