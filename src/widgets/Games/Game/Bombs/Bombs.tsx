import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, type CSSProperties } from "react"
import { toast } from "react-toastify"
import GameApi from "@/Api/Game"
import type { BombsCell, BombsCellKind, BombsRewardKind, BombsState } from "@/Api/Game/Types"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"
import Config from "@/Shared/Configs/Game/Bombs"
import type { GameRef } from "@/Shared/Types/GameTypes"
import type { BombsGameContainerRef } from "../../Layout/BombsGameContainer"
import styles from "./Bombs.module.css"

type BombsProps = {
    data: BombsGameContainerRef | null
    onPendingChange?: (value: boolean) => void
}

type DemoCell = {
    kind: BombsCellKind
    rewardKind?: BombsRewardKind
}

type ExplosionParticle = {
    id: number
    x: number
    y: number
    rotate: number
    delay: number
}

const createClosedCells = (rows = Config.GRID_Y_SIZE, cols = Config.GRID_X_SIZE): BombsCell[] => {
    return Array.from({ length: rows * cols }, (_, index) => ({
        index,
        isOpened: false
    }))
}

const formatMultiplier = (value: number) => {
    return `x${value.toFixed(2).replace(/\.?0+$/, "")}`
}

const getCellTexture = (cell: BombsCell) => {
    if (!cell.isOpened) return Config.CLOSED_TILE_TEXTURE
    if (cell.kind === "bomb") return Config.BAD_TILES.tnt.texture
    if (cell.kind === "reward" && cell.rewardKind) return Config.GOOD_TILES[cell.rewardKind]?.texture ?? Config.GOOD_TILES.iron.texture
    return Config.DEFAULT_TILE.empty.texture
}

const getCellSound = (cell: BombsCell) => {
    if (cell.kind === "bomb") return Config.BAD_TILES.tnt.sound.open
    if (cell.kind === "reward" && cell.rewardKind) return Config.GOOD_TILES[cell.rewardKind]?.sound.open ?? Config.GOOD_TILES.iron.sound.open
    return Config.DEFAULT_TILE.empty.sound.open
}

const playSound = (url: string) => {
    const audio = new Audio(url)
    audio.volume = 0.18
    void audio.play().catch(() => undefined)
}

const pickRewardKind = (): BombsRewardKind => {
    const random = Math.random()
    if (random > 0.92) return "diamond"
    if (random > 0.68) return "gold"
    return "iron"
}

const getRewardMultiplier = (kind?: BombsRewardKind) => {
    return kind ? Config.GOOD_TILES[kind]?.multiplier ?? 0 : 0
}

const createDemoField = (): DemoCell[] => {
    const total = Config.GRID_X_SIZE * Config.GRID_Y_SIZE
    const bombs = 5
    const field: DemoCell[] = Array.from({ length: bombs }, () => ({ kind: "bomb" }))

    for (let i = bombs; i < total; i++) {
        if (Math.random() > 0.45) {
            field.push({ kind: "reward", rewardKind: pickRewardKind() })
        } else {
            field.push({ kind: "empty" })
        }
    }

    for (let i = field.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const current = field[i]
        field[i] = field[j]
        field[j] = current
    }

    return field
}

const createExplosionParticles = (): ExplosionParticle[] => {
    const count = Config.EXPLODE_PARTICLES_COUNT
    const minDistance = Config.EXPLODE_PARTICLES_MIN_DISTANCE
    const distanceRange = Config.EXPLODE_PARTICLES_MAX_DISTANCE - minDistance
    const angleStep = (Math.PI * 2) / count
    const angleOffset = Math.random() * Math.PI * 2

    return Array.from({ length: count }, (_, particleIndex) => {
        const angle = angleOffset + particleIndex * angleStep + (Math.random() - 0.5) * angleStep * 0.65
        const distance = minDistance + Math.random() * distanceRange

        return {
            id: Date.now() + particleIndex,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rotate: Math.random() * 540 - 270,
            delay: Math.random() * Config.EXPLODE_PARTICLES_MAX_DELAY_MS
        }
    })
}

const Bombs = forwardRef<GameRef, BombsProps>((props, ref) => {
    const { data, onPendingChange } = props
    const socketRef = useRef<ReturnType<typeof GameApi.createBombsSocket> | null>(null)
    const isActiveRef = useRef(false)
    const demoFieldRef = useRef<DemoCell[]>([])
    const revealTimerRef = useRef<number | null>(null)
    const [rows, setRows] = useState(Config.GRID_Y_SIZE)
    const [cols, setCols] = useState(Config.GRID_X_SIZE)
    const [cells, setCells] = useState<BombsCell[]>(() => createClosedCells())
    const [isActive, setIsActive] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [multiplier, setMultiplier] = useState(1)
    const [currentWin, setCurrentWin] = useState(0)
    const [explodedIndex, setExplodedIndex] = useState<number | null>(null)
    const [particles, setParticles] = useState<ExplosionParticle[]>([])

    const { account } = useContext(AuthContext)
    const { flushBalanceUpdate, incrementBalance, queueBalanceUpdate } = useContext(AccountContext)

    useEffect(() => {
        isActiveRef.current = isActive
    }, [isActive])

    useEffect(() => {
        return () => {
            if (revealTimerRef.current !== null) {
                window.clearTimeout(revealTimerRef.current)
            }
        }
    }, [])

    const applyState = useCallback((state: BombsState) => {
        setRows(state.rows)
        setCols(state.cols)
        setCells(state.cells)
        setIsActive(state.isActive)
        setMultiplier(state.multiplier)
        setCurrentWin(state.currentWin)
        if (state.newBalance !== undefined) {
            queueBalanceUpdate(state.newBalance)
        }
    }, [queueBalanceUpdate])

    const finishGame = useCallback((state: BombsState, isDemo: boolean) => {
        applyState(state)

        if (!isDemo) {
            flushBalanceUpdate()
        }

        if (state.isWin && !isDemo) {
            data?.setWinAmount(state.currentWin)
            data?.StateMachine.changeState("WIN")
            return
        }

        data?.setWinAmount(0)
        data?.StateMachine.changeState("IDLE")
    }, [applyState, data, flushBalanceUpdate])

    const finishDemo = useCallback((nextCells: BombsCell[], nextMultiplier: number, isWin: boolean) => {
        const bet = data?.bet ?? 0
        const currentWinValue = isWin ? Math.trunc(bet * nextMultiplier) : 0

        finishGame({
            rows: Config.GRID_Y_SIZE,
            cols: Config.GRID_X_SIZE,
            bet,
            openedCount: nextCells.filter(cell => cell.isOpened).length,
            multiplier: isWin ? nextMultiplier : 0,
            currentWin: currentWinValue,
            isActive: false,
            isWin,
            cells: nextCells,
        }, true)
    }, [data, finishGame])

    const play = useCallback((bet?: number) => {
        if (!data || isActive || isPending) return

        if (revealTimerRef.current !== null) {
            window.clearTimeout(revealTimerRef.current)
            revealTimerRef.current = null
        }

        const currentBet = bet ?? data.bet
        setIsPending(true)
        setCells(createClosedCells())
        setMultiplier(1)
        setCurrentWin(0)
        setExplodedIndex(null)
        setParticles([])
        data.StateMachine.changeState("PLAYING")

        if (data.isDemo) {
            demoFieldRef.current = createDemoField()
            setIsActive(true)
            setIsPending(false)
            return
        }

        const socket = socketRef.current
        if (!socket || !account) {
            data.StateMachine.changeState("IDLE")
            setIsPending(false)
            return
        }

        incrementBalance(-currentBet)
        void GameApi.emitBombs(socket, "bombs:start", { bet: currentBet }).then(response => {
            if (response.ok === false) {
                incrementBalance(currentBet)
                data.StateMachine.changeState("IDLE")
                toast.error(response.message)
                return
            }

            applyState(response.data)
            flushBalanceUpdate()
        }).catch(() => {
            incrementBalance(currentBet)
            data.StateMachine.changeState("IDLE")
            toast.error("Не удалось запустить Мины")
        }).finally(() => {
            setIsPending(false)
        })
    }, [account, applyState, data, flushBalanceUpdate, incrementBalance, isActive, isPending])

    const openDemoCell = useCallback((index: number) => {
        const demoCell = demoFieldRef.current[index]
        if (!demoCell) return

        const nextCells = cells.map(cell => cell.index === index ? {
            ...cell,
            isOpened: true,
            kind: demoCell.kind,
            rewardKind: demoCell.rewardKind
        } : cell)
        const openedCell = nextCells[index]
        playSound(getCellSound(openedCell))

        if (demoCell.kind === "bomb") {
            setExplodedIndex(index)
            setParticles(createExplosionParticles())
            const revealed = nextCells.map((cell, cellIndex) => {
                const fieldCell = demoFieldRef.current[cellIndex]
                return {
                    ...cell,
                    isOpened: true,
                    kind: fieldCell.kind,
                    rewardKind: fieldCell.rewardKind
                }
            })
            setCells(nextCells)
            setIsActive(false)
            revealTimerRef.current = window.setTimeout(() => {
                setCells(revealed)
                finishDemo(revealed, 0, false)
                revealTimerRef.current = null
            }, Config.EXPLODE_REVEAL_DELAY_MS)
            return
        }

        const nextMultiplier = demoCell.kind === "reward"
            ? Math.floor((multiplier + getRewardMultiplier(demoCell.rewardKind)) * 100) / 100
            : multiplier

        setCells(nextCells)
        setMultiplier(nextMultiplier)
        setCurrentWin(Math.trunc((data?.bet ?? 0) * nextMultiplier))
    }, [cells, data, finishDemo, multiplier])

    const openCell = useCallback((index: number) => {
        if (!isActive || isPending) return
        const cell = cells[index]
        if (!cell || cell.isOpened) return

        if (data?.isDemo) {
            openDemoCell(index)
            return
        }

        const socket = socketRef.current
        if (!socket) return

        setIsPending(true)
        void GameApi.emitBombs(socket, "bombs:open", { index }).then(response => {
            if (response.ok === false) {
                toast.error(response.message)
                return
            }

            const opened = response.data.cells[index]
            if (opened) {
                playSound(getCellSound(opened))
                if (opened.kind === "bomb") {
                    setExplodedIndex(index)
                    setParticles(createExplosionParticles())
                    setCells(prevCells => prevCells.map(cell => cell.index === index ? opened : cell))
                    setIsActive(false)
                }
            }

            if (response.data.isActive) {
                applyState(response.data)
                return
            }

            if (opened?.kind === "bomb") {
                revealTimerRef.current = window.setTimeout(() => {
                    finishGame(response.data, false)
                    revealTimerRef.current = null
                }, Config.EXPLODE_REVEAL_DELAY_MS)
                return
            }

            finishGame(response.data, false)
        }).catch(() => {
            toast.error("Не удалось открыть клетку")
        }).finally(() => {
            setIsPending(false)
        })
    }, [applyState, cells, data, finishGame, isActive, isPending, openDemoCell])

    const cashout = useCallback(() => {
        if (!isActive || isPending) return

        if (data?.isDemo) {
            finishDemo(cells, multiplier, currentWin > (data?.bet ?? 0))
            return
        }

        const socket = socketRef.current
        if (!socket) return

        onPendingChange?.(true)
        setIsPending(true)
        void GameApi.emitBombs(socket, "bombs:cashout").then(response => {
            if (response.ok === false) {
                toast.error(response.message)
                return
            }

            finishGame(response.data, false)
        }).catch(() => {
            toast.error("Не удалось забрать выигрыш")
        }).finally(() => {
            setIsPending(false)
            onPendingChange?.(false)
        })
    }, [cells, currentWin, data, finishDemo, finishGame, isActive, isPending, multiplier, onPendingChange])

    useEffect(() => {
        const socket = GameApi.createBombsSocket()
        socketRef.current = socket

        return () => {
            if (isActiveRef.current) {
                socket.emit("bombs:cashout", undefined, (response: unknown) => {
                    const result = response as { ok?: boolean, data?: BombsState }
                    if (result.ok && result.data?.newBalance !== undefined) {
                        queueBalanceUpdate(result.data.newBalance)
                        flushBalanceUpdate()
                    }
                    socket.disconnect()
                })
                window.setTimeout(() => socket.disconnect(), 120)
                return
            }

            socket.disconnect()
        }
    }, [flushBalanceUpdate, queueBalanceUpdate])

    useImperativeHandle(ref, () => ({ play, cashout }), [cashout, play])

    const gridStyle = useMemo(() => ({
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    }), [cols])

    return (
        <div className={`${styles.bombs} ${!isActive && explodedIndex === null ? styles.inactive : ""}`}>
            <div className={styles.board} style={gridStyle}>
                {cells.map(cell => (
                    <button
                        className={[
                            styles.cell,
                            cell.isOpened ? styles.opened : "",
                            cell.kind ? styles[`cell-${cell.kind}`] : "",
                            explodedIndex === cell.index ? styles.exploded : ""
                        ].filter(Boolean).join(" ")}
                        key={cell.index}
                        type="button"
                        style={{ backgroundImage: `url(${getCellTexture(cell)})` }}
                        disabled={!isActive || isPending || cell.isOpened}
                        onClick={() => openCell(cell.index)}
                    >
                        {explodedIndex === cell.index && particles.map(particle => (
                            <span
                                className={styles.particle}
                                key={particle.id}
                                style={{
                                    backgroundImage: `url(${Config.EXPLODE_PARTICLE})`,
                                    "--particle-x": `${particle.x}px`,
                                    "--particle-y": `${particle.y}px`,
                                    "--particle-rotate": `${particle.rotate}deg`,
                                    "--particle-duration": `${Config.EXPLODE_PARTICLES_DURATION_MS}ms`,
                                    animationDelay: `${particle.delay}ms`
                                } as CSSProperties}
                            />
                        ))}
                    </button>
                ))}
            </div>

            <div className={styles.panel}>
                <div>
                    <span>Множитель</span>
                    <strong>{formatMultiplier(multiplier)}</strong>
                </div>
                <div>
                    <span>Сейчас</span>
                    <strong>{currentWin}</strong>
                </div>
            </div>
        </div>
    )
})

export default memo(Bombs)
