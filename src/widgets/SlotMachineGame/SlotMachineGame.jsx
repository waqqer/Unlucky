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
import DemoMode from "@/components/DemoMode"
import slotSound from "@/shared/audio/slot.mp3"
import styles from "./SlotMachineGame.module.css"

const SYMBOLS = ["coal", "iron", "gold", "diamond"]

const SlotMachineGame = (props) => {
    const {
        className,
        onGameComplete,
        onHistoryUpdate,
        soundEnabled = true
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

    // Демо режим
    const [demoMode, setDemoMode] = useState(false)

    // Синхронизация ref с состоянием
    useEffect(() => {
        autoRerollEnabledRef.current = autoRerollEnabled
    }, [autoRerollEnabled])

    // Выключение звука при изменении soundEnabled
    useEffect(() => {
        if (!soundEnabled && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.playbackRate = 1.2
            audioRef.current.currentTime = 0
        }
    }, [soundEnabled])

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

    // Обработчик переключения демо-режима
    const handleDemoToggle = useCallback(() => {
        setDemoMode(prev => !prev)
    }, [])

    const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

    const spin = useCallback(async () => {
        // Блокировка во время запроса или анимации
        if (isRequestPending || isSpinning) {
            console.warn("Spin blocked:", { isRequestPending, isSpinning })
            return
        }

        // В демо-режиме запускаем без проверок, в обычном - проверяем наличие пользователя
        if (!demoMode && !account?.name) {
            console.warn("Spin blocked: user not authenticated")
            return
        }

        // Проверка звука - если выключен, не запускаем
        // (звук будет проверен непосредственно перед воспроизведением)

        const currentBalance = parseFloat(account?.balance || 0)
        // В демо-режиме не проверяем баланс
        if (!demoMode && (bet <= 0 || bet > currentBalance)) {
            console.warn("Недостаточно средств или неверная ставка", { bet, currentBalance })
            setAutoRerollEnabled(false)
            return
        }

        setWinAmount(null)
        setIsRequestPending(true)
        setStoppedReels([false, false, false])

        // Останавливаем предыдущий звук если он есть
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        try {
            // Сначала запрос к серверу (демо или обычный)
            const result = demoMode 
                ? await SlotsApi.demoSpin()  // Демо не требует авторизации
                : await SlotsApi.spin(account.name, bet)
            
            // В демо-режиме получаем только комбинацию
            const win = demoMode ? 0 : (result.winAmount || 0)
            const newBalance = demoMode ? account?.balance || 0 : result.newBalance
            const combination = result.combination || ["coal", "coal", "coal"]
            const multiplier = demoMode ? 0 : (result.multiplier || 0)

            // Обновляем баланс только в обычном режиме
            if (!demoMode && newBalance !== undefined && isMounted.current) {
                updateUser({ balance: newBalance.toString() })
            }

            // Теперь запускаем анимацию
            setIsSpinning(true)

            // Запускаем звук только если он включён
            if (audioRef.current && soundEnabled) {
                audioRef.current.currentTime = 0
                audioRef.current.loop = true
                audioRef.current.playbackRate = 1.2
                audioRef.current.play().catch(err => {
                    console.warn("Audio play failed:", err)
                })
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

                // Проверяем, не выключили ли звук во время вращения
                if (!soundEnabled && audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause()
                }

                // Обновляем барабаны с использованием функционального обновления
                setStoppedReels(prevStopped => {
                    const newStopped = [...prevStopped]
                    const newReels = []
                    
                    for (let i = 0; i < 3; i++) {
                        if (!newStopped[i] && spinIndex >= maxSpins + reelDelays[i]) {
                            newReels[i] = combination[i]
                            newStopped[i] = true
                        } else if (!newStopped[i]) {
                            newReels[i] = getRandomSymbol()
                        } else {
                            newReels[i] = combination[i]
                        }
                    }
                    
                    setReels(newReels)
                    
                    // Проверяем, все ли барабаны остановились
                    if (newStopped.every(stopped => stopped)) {
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

                        // В демо-режиме не показываем победу и не обновляем статистику
                        if (!demoMode) {
                            if (isWin) {
                                StatsApi.change(account.name, 1, 0, 1)
                                setShowVictory(true)
                                setConsecutiveLosses(0)
                            } else {
                                StatsApi.change(account.name, 0, 1, 1)
                                const newConsecutiveLosses = consecutiveLosses + 1
                                setConsecutiveLosses(newConsecutiveLosses)
                            }
                        }

                        // Уведомляем о необходимости обновить историю (только не в демо)
                        if (onHistoryUpdate && !demoMode) {
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
                            // В демо-режиме не проверяем баланс - играем бесконечно
                            if (demoMode) {
                                autoRerollTimeoutRef.current = setTimeout(() => {
                                    // Проверяем ещё раз на момент запуска
                                    if (isMounted.current && autoRerollEnabledRef.current && demoMode) {
                                        spin()
                                    }
                                }, 500)
                            } else {
                                // В обычном режиме проверяем баланс
                                const nextBalance = parseFloat(newBalance || account.balance || 0)
                                if (nextBalance >= bet) {
                                    autoRerollTimeoutRef.current = setTimeout(() => {
                                        // Проверяем ещё раз на момент запуска
                                        if (isMounted.current && autoRerollEnabledRef.current && !demoMode) {
                                            spin()
                                        }
                                    }, 500)
                                } else {
                                    setAutoRerollEnabled(false)
                                }
                            }
                        }
                    }
                    
                    return newStopped
                })
            }, 100)

        } catch (error) {
            console.error("Ошибка при спине:", error)
            setIsSpinning(false)
            setIsRequestPending(false)
            setAutoRerollEnabled(false)
        }
    }, [bet, isSpinning, isRequestPending, account, demoMode, updateUser, onGameComplete, onHistoryUpdate, autoRerollEnabled, consecutiveLosses, soundEnabled])

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
                        presets={[1, 5, 10, 50, 500]}
                    />
                </div>

                <AutoReroll
                    enabled={autoRerollEnabled}
                    onToggle={handleAutoRerollToggle}
                />

                <DemoMode
                    enabled={demoMode}
                    onToggle={handleDemoToggle}
                    disabled={isSpinning}
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
