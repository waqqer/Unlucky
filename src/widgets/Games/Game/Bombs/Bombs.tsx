import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { toast } from "react-toastify"
import { Application, Assets, Container, FederatedPointerEvent, Graphics, Rectangle, Sprite, Texture } from "pixi.js"
import { gsap } from "gsap"
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
    x: number
    y: number
    rotate: number
    delay: number
}

type Runtime = {
    app: Application
    root: Container
    cellsLayer: Container
    hitLayer: Container
    effectsLayer: Container
    resizeObserver: ResizeObserver | null
}

const CELL_SIZE = 96
const GRID_GAP = 10
const STAGE_PADDING = 8

const pixelAsset = (src: string) => ({
    src,
    data: {
        scaleMode: "nearest" as const
    }
})

const makePixelTexture = (texture: Texture) => {
    const source = texture.source as Texture["source"] & {
        scaleMode?: "nearest" | "linear"
        style?: {
            scaleMode?: "nearest" | "linear"
            update?: () => void
        }
    }

    source.scaleMode = "nearest"
    if (source.style) {
        source.style.scaleMode = "nearest"
        source.style.update?.()
    }

    return texture
}

const getTexture = (src: string) => makePixelTexture(Assets.get<Texture>(src) || Texture.from(src))

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
    audio.preload = "auto"
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
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rotate: Math.random() * 540 - 270,
            delay: Math.random() * Config.EXPLODE_PARTICLES_MAX_DELAY_MS
        }
    })
}

const animateCellOpen = (sprite: Sprite, x: number, y: number, delay = 0) => {
    const baseScaleX = sprite.scale.x
    const baseScaleY = sprite.scale.y
    const inset = CELL_SIZE * 0.1

    sprite.alpha = 0.45
    sprite.x = x + inset
    sprite.y = y + inset
    sprite.scale.set(baseScaleX * 0.8, baseScaleY * 0.8)

    gsap.to(sprite, {
        alpha: 1,
        delay,
        duration: 0.16,
        ease: "power2.out"
    })
    gsap.to(sprite, {
        x,
        y,
        delay,
        duration: 0.28,
        ease: "back.out(1.9)"
    })
    gsap.to(sprite.scale, {
        x: baseScaleX,
        y: baseScaleY,
        delay,
        duration: 0.28,
        ease: "back.out(1.9)"
    })
}

const animateBoardState = (runtime: Runtime, isEnabled: boolean) => {
    gsap.killTweensOf(runtime.cellsLayer)
    gsap.to(runtime.cellsLayer, {
        alpha: isEnabled ? 1 : 0.42,
        duration: 0.34,
        ease: "power2.out"
    })
}

const SOCKET_CONNECT_TIMEOUT_MS = 8000

const Bombs = forwardRef<GameRef, BombsProps>((props, ref) => {
    const { data, onPendingChange } = props
    const hostRef = useRef<HTMLDivElement>(null)
    const runtimeRef = useRef<Runtime | null>(null)
    const socketRef = useRef<ReturnType<typeof GameApi.createBombsSocket> | null>(null)
    const openCellRef = useRef<(index: number) => void>(() => undefined)
    const drawBoardRef = useRef<() => void>(() => undefined)
    const resizeSceneRef = useRef<() => void>(() => undefined)
    const updateBoardStateRef = useRef<() => void>(() => undefined)
    const isActiveRef = useRef(false)
    const isPendingRef = useRef(false)
    const cellsRef = useRef<BombsCell[]>(createClosedCells())
    const gameIdRef = useRef<string | null>(null)
    const animatedOpenedCellsRef = useRef<Set<number>>(new Set())
    const isBoardEnabledRef = useRef(false)
    const shouldDimPendingRef = useRef(false)
    const shouldAnimateResultRevealRef = useRef(false)
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

    const { account } = useContext(AuthContext)
    const { disableReferralCodeApply, flushBalanceUpdate, incrementBalance, queueBalanceUpdate } = useContext(AccountContext)

    const createFreshSocket = useCallback(() => {
        socketRef.current?.disconnect()
        const socket = GameApi.createBombsSocket()
        socketRef.current = socket
        return socket
    }, [])

    const getReadySocket = useCallback(() => {
        return new Promise<ReturnType<typeof GameApi.createBombsSocket> | null>(resolve => {
            const socket = socketRef.current?.connected ? socketRef.current : createFreshSocket()

            if (socket.connected) {
                resolve(socket)
                return
            }

            const cleanup = () => {
                window.clearTimeout(timer)
                socket.off("connect", handleConnect)
                socket.off("connect_error", handleError)
                socket.off("disconnect", handleError)
            }
            const handleConnect = () => {
                cleanup()
                resolve(socket)
            }
            const handleError = () => {
                cleanup()
                if (socketRef.current === socket) {
                    socket.disconnect()
                    socketRef.current = null
                }
                resolve(null)
            }
            const timer = window.setTimeout(handleError, SOCKET_CONNECT_TIMEOUT_MS)

            socket.once("connect", handleConnect)
            socket.once("connect_error", handleError)
            socket.once("disconnect", handleError)
            socket.connect()
        })
    }, [createFreshSocket])

    const resizeScene = useCallback(() => {
        const host = hostRef.current
        const runtime = runtimeRef.current
        if (!host || !runtime) return

        const width = Math.max(1, host.clientWidth)
        const height = Math.max(1, host.clientHeight)
        const worldWidth = cols * CELL_SIZE + Math.max(0, cols - 1) * GRID_GAP
        const worldHeight = rows * CELL_SIZE + Math.max(0, rows - 1) * GRID_GAP
        const paddedWidth = worldWidth + STAGE_PADDING * 2
        const paddedHeight = worldHeight + STAGE_PADDING * 2
        const scale = Math.min(width / paddedWidth, height / paddedHeight)

        runtime.app.renderer.resize(width, height)
        runtime.app.canvas.style.width = `${width}px`
        runtime.app.canvas.style.height = `${height}px`
        runtime.root.scale.set(scale)
        runtime.root.x = (width - paddedWidth * scale) / 2 + STAGE_PADDING * scale
        runtime.root.y = (height - paddedHeight * scale) / 2 + STAGE_PADDING * scale
    }, [cols, rows])

    const spawnExplosion = useCallback((index: number) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const row = Math.floor(index / cols)
        const col = index % cols
        const centerX = col * (CELL_SIZE + GRID_GAP) + CELL_SIZE / 2
        const centerY = row * (CELL_SIZE + GRID_GAP) + CELL_SIZE / 2

        const flash = new Graphics()
            .circle(0, 0, CELL_SIZE * 0.72)
            .fill({ color: 0xff7438, alpha: 0.72 })
        flash.x = centerX
        flash.y = centerY
        runtime.effectsLayer.addChild(flash)

        gsap.to(flash.scale, {
            x: 1.55,
            y: 1.55,
            duration: 0.34,
            ease: "power2.out"
        })
        gsap.to(flash, {
            alpha: 0,
            duration: 0.34,
            ease: "power2.out",
            onComplete: () => flash.destroy()
        })

        createExplosionParticles().forEach(particle => {
            const sprite = new Sprite(getTexture(Config.EXPLODE_PARTICLE))
            sprite.anchor.set(0.5)
            sprite.x = centerX
            sprite.y = centerY
            sprite.width = CELL_SIZE * 0.18
            sprite.height = CELL_SIZE * 0.18
            sprite.rotation = 0
            sprite.alpha = 0
            runtime.effectsLayer.addChild(sprite)

            gsap.to(sprite, {
                alpha: 1,
                delay: particle.delay / 1000,
                duration: 0.03,
                ease: "none"
            })
            gsap.to(sprite, {
                x: centerX + particle.x,
                y: centerY + particle.y,
                rotation: particle.rotate * Math.PI / 180,
                alpha: 0,
                delay: particle.delay / 1000,
                duration: Config.EXPLODE_PARTICLES_DURATION_MS / 1000,
                ease: "power2.out",
                onComplete: () => sprite.destroy()
            })
        })
    }, [cols])

    const updateBoardState = useCallback(() => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const isBoardEnabled = isActiveRef.current && !isPendingRef.current
        const isVisuallyEnabled = isActiveRef.current && (!isPendingRef.current || !shouldDimPendingRef.current)
        runtime.hitLayer.eventMode = isBoardEnabled ? "static" : "none"
        runtime.hitLayer.cursor = isBoardEnabled ? "pointer" : "default"

        if (isBoardEnabledRef.current !== isVisuallyEnabled) {
            isBoardEnabledRef.current = isVisuallyEnabled
            animateBoardState(runtime, isVisuallyEnabled)
        }
    }, [])

    const drawBoard = useCallback(() => {
        const runtime = runtimeRef.current
        if (!runtime) return
        const isBoardEnabled = isActiveRef.current && !isPendingRef.current
        const shouldAnimateResultReveal = shouldAnimateResultRevealRef.current

        runtime.cellsLayer.removeChildren().forEach(child => {
            gsap.killTweensOf(child)
            gsap.killTweensOf(child.scale)
            child.destroy()
        })
        runtime.hitLayer.removeChildren().forEach(child => child.destroy())

        runtime.hitLayer.eventMode = isBoardEnabled ? "static" : "none"

        cellsRef.current.forEach(cell => {
            const row = Math.floor(cell.index / cols)
            const col = cell.index % cols
            const x = col * (CELL_SIZE + GRID_GAP)
            const y = row * (CELL_SIZE + GRID_GAP)

            const sprite = new Sprite(getTexture(getCellTexture(cell)))
            sprite.x = x
            sprite.y = y
            sprite.width = CELL_SIZE
            sprite.height = CELL_SIZE
            sprite.eventMode = "none"
            sprite.alpha = !isActiveRef.current && explodedIndex === null ? 0.82 : 1
            sprite.tint = !isActiveRef.current && explodedIndex === null ? 0x686868 : 0xffffff
            runtime.cellsLayer.addChild(sprite)

            if (cell.isOpened && !animatedOpenedCellsRef.current.has(cell.index) && (isBoardEnabled || cell.index === explodedIndex || shouldAnimateResultReveal)) {
                animatedOpenedCellsRef.current.add(cell.index)
                const delay = shouldAnimateResultReveal ? (row + col) * 0.025 : 0
                animateCellOpen(sprite, x, y, delay)
            }

            const border = new Graphics()
                .rect(0.5, 0.5, CELL_SIZE - 1, CELL_SIZE - 1)
                .stroke({
                    color: cell.kind === "bomb" ? 0xff7a7a : cell.kind === "reward" ? 0x81e09d : 0xffffff,
                    alpha: cell.kind ? 0.72 : 0.16,
                    width: 2
                })
            border.x = x
            border.y = y
            border.eventMode = "none"
            runtime.cellsLayer.addChild(border)

            const hitArea = new Graphics()
                .rect(0, 0, CELL_SIZE, CELL_SIZE)
                .fill({ color: 0xffffff, alpha: 0.001 })
            hitArea.x = x
            hitArea.y = y
            hitArea.eventMode = "static"
            hitArea.cursor = !cell.isOpened && isBoardEnabled ? "pointer" : "default"
            hitArea.hitArea = new Rectangle(0, 0, CELL_SIZE, CELL_SIZE)
            hitArea.on("pointertap", (event: FederatedPointerEvent) => {
                event.stopPropagation()
                if (cell.isOpened || !isActiveRef.current || isPendingRef.current) return
                openCellRef.current(cell.index)
            })
            runtime.hitLayer.addChild(hitArea)
        })

        updateBoardStateRef.current()

        if (shouldAnimateResultReveal) {
            shouldAnimateResultRevealRef.current = false
        }
    }, [cols, explodedIndex])

    useEffect(() => {
        drawBoardRef.current = drawBoard
    }, [drawBoard])

    useEffect(() => {
        resizeSceneRef.current = resizeScene
    }, [resizeScene])

    useEffect(() => {
        updateBoardStateRef.current = updateBoardState
    }, [updateBoardState])

    useEffect(() => {
        isActiveRef.current = isActive
    }, [isActive])

    useEffect(() => {
        isPendingRef.current = isPending
    }, [isPending])

    useEffect(() => {
        cellsRef.current = cells
    }, [cells])

    useEffect(() => {
        return () => {
            if (revealTimerRef.current !== null) {
                window.clearTimeout(revealTimerRef.current)
            }
        }
    }, [])

    const applyState = useCallback((state: BombsState) => {
        gameIdRef.current = state.gameId
        cellsRef.current = state.cells
        isActiveRef.current = state.isActive
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
            data?.pushHistory(Math.trunc(state.currentWin - state.bet))
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
            gameId: "demo",
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
        const closedCells = createClosedCells()
        gameIdRef.current = null
        cellsRef.current = closedCells
        animatedOpenedCellsRef.current.clear()
        shouldAnimateResultRevealRef.current = false
        shouldDimPendingRef.current = true
        isPendingRef.current = true
        isActiveRef.current = false
        setIsPending(true)
        setCells(closedCells)
        setMultiplier(1)
        setCurrentWin(0)
        setExplodedIndex(null)
        data.StateMachine.changeState("PLAYING")

        if (data.isDemo) {
            demoFieldRef.current = createDemoField()
            isActiveRef.current = true
            isPendingRef.current = false
            shouldDimPendingRef.current = false
            setIsActive(true)
            setIsPending(false)
            requestAnimationFrame(() => drawBoardRef.current())
            return
        }

        if (!account) {
            isPendingRef.current = false
            isActiveRef.current = false
            shouldDimPendingRef.current = false
            data.StateMachine.changeState("IDLE")
            setIsPending(false)
            return
        }

        let startSocket: ReturnType<typeof GameApi.createBombsSocket> | null = null

        void getReadySocket().then(socket => {
            if (!socket) {
                data.StateMachine.changeState("IDLE")
                toast.error("Не удалось подключиться к серверу")
                return null
            }

            startSocket = socket
            incrementBalance(-currentBet)
            return GameApi.emitBombs(socket, "bombs:start", { bet: currentBet })
        }).then(response => {
            if (!response) return

            if (response.ok === false) {
                incrementBalance(currentBet)
                if (response.message === "Сервер не отвечает" && startSocket) {
                    startSocket.emit("bombs:cashout")
                    createFreshSocket()
                }
                data.StateMachine.changeState("IDLE")
                toast.error(response.message)
                return
            }

            disableReferralCodeApply()
            applyState(response.data)
            flushBalanceUpdate()
            requestAnimationFrame(() => drawBoardRef.current())
        }).catch(() => {
            incrementBalance(currentBet)
            data.StateMachine.changeState("IDLE")
            toast.error("Не удалось запустить Мины")
        }).finally(() => {
            isPendingRef.current = false
            shouldDimPendingRef.current = false
            setIsPending(false)
            requestAnimationFrame(() => updateBoardStateRef.current())
        })
    }, [account, applyState, createFreshSocket, data, disableReferralCodeApply, flushBalanceUpdate, getReadySocket, incrementBalance, isActive, isPending])

    const openDemoCell = useCallback((index: number) => {
        const demoCell = demoFieldRef.current[index]
        if (!demoCell) return
        const currentCells = cellsRef.current
        const currentCell = currentCells[index]
        if (!currentCell || currentCell.isOpened) return

        const nextCells = currentCells.map(cell => cell.index === index ? {
            ...cell,
            isOpened: true,
            kind: demoCell.kind,
            rewardKind: demoCell.rewardKind
        } : cell)
        cellsRef.current = nextCells
        const openedCell = nextCells[index]
        playSound(getCellSound(openedCell))

        if (demoCell.kind === "bomb") {
            setExplodedIndex(index)
            spawnExplosion(index)
            const revealed = nextCells.map((cell, cellIndex) => {
                const fieldCell = demoFieldRef.current[cellIndex]
                return {
                    ...cell,
                    isOpened: true,
                    kind: fieldCell.kind,
                    rewardKind: fieldCell.rewardKind
                }
            })
            cellsRef.current = revealed
            setCells(revealed)
            setIsActive(false)
            finishDemo(revealed, 0, false)
            return
        }

        const nextMultiplier = demoCell.kind === "reward"
            ? Math.floor((multiplier + getRewardMultiplier(demoCell.rewardKind)) * 100) / 100
            : multiplier

        setCells(nextCells)
        setMultiplier(nextMultiplier)
        setCurrentWin(Math.trunc((data?.bet ?? 0) * nextMultiplier))
    }, [data, finishDemo, multiplier, spawnExplosion])

    const openCell = useCallback((index: number) => {
        if (!isActiveRef.current || isPendingRef.current) return
        const cell = cellsRef.current[index]
        if (!cell || cell.isOpened) return

        if (data?.isDemo) {
            openDemoCell(index)
            return
        }

        isPendingRef.current = true
        shouldDimPendingRef.current = false
        setIsPending(true)
        requestAnimationFrame(() => updateBoardStateRef.current())
        void getReadySocket().then(socket => {
            if (!socket) {
                toast.error("Не удалось подключиться к серверу")
                return null
            }

            return GameApi.emitBombs(socket, "bombs:open", {
                index,
                gameId: gameIdRef.current ?? undefined,
                requestId: `open:${index}`
            })
        }).then(response => {
            if (!response) return

            if (response.ok === false) {
                toast.error(response.message)
                return
            }

            const opened = response.data.cells[index]
            if (opened) {
                playSound(getCellSound(opened))
                if (opened.kind === "bomb") {
                    setExplodedIndex(index)
                    setCells(prevCells => prevCells.map(cell => cell.index === index ? opened : cell))
                    setIsActive(false)
                    spawnExplosion(index)
                }
            }

            if (response.data.isActive) {
                isPendingRef.current = false
                shouldDimPendingRef.current = false
                setIsPending(false)
                applyState(response.data)
                return
            }

            if (opened?.kind === "bomb") {
                finishGame(response.data, false)
                return
            }

            finishGame(response.data, false)
        }).catch(() => {
            toast.error("Не удалось открыть клетку")
        }).finally(() => {
            isPendingRef.current = false
            shouldDimPendingRef.current = false
            setIsPending(false)
            requestAnimationFrame(() => updateBoardStateRef.current())
        })
    }, [applyState, data, finishGame, getReadySocket, openDemoCell, spawnExplosion])

    const cashout = useCallback(() => {
        if (!isActiveRef.current || isPendingRef.current) return

        if (data?.isDemo) {
            isPendingRef.current = true
            shouldDimPendingRef.current = true
            setIsPending(true)
            requestAnimationFrame(() => updateBoardStateRef.current())
            shouldAnimateResultRevealRef.current = true
            finishDemo(cellsRef.current, multiplier, currentWin > (data?.bet ?? 0))
            isPendingRef.current = false
            shouldDimPendingRef.current = false
            setIsPending(false)
            return
        }

        onPendingChange?.(true)
        isPendingRef.current = true
        shouldDimPendingRef.current = true
        setIsPending(true)
        requestAnimationFrame(() => updateBoardStateRef.current())
        void getReadySocket().then(socket => {
            if (!socket) {
                toast.error("Не удалось подключиться к серверу")
                return null
            }

            return GameApi.emitBombs(socket, "bombs:cashout", {
                gameId: gameIdRef.current ?? undefined,
                requestId: "cashout"
            })
        }).then(response => {
            if (!response) return

            if (response.ok === false) {
                toast.error(response.message)
                return
            }

            shouldAnimateResultRevealRef.current = true
            finishGame(response.data, false)
        }).catch(() => {
            toast.error("Не удалось забрать выигрыш")
        }).finally(() => {
            isPendingRef.current = false
            shouldDimPendingRef.current = false
            setIsPending(false)
            onPendingChange?.(false)
        })
    }, [currentWin, data, finishDemo, finishGame, getReadySocket, multiplier, onPendingChange])

    useEffect(() => {
        const socket = GameApi.createBombsSocket()
        socketRef.current = socket

        return () => {
            const currentSocket = socketRef.current ?? socket

            if (isActiveRef.current) {
                currentSocket.emit("bombs:cashout", {
                    gameId: gameIdRef.current ?? undefined,
                    requestId: "disconnect-cashout"
                }, (response: unknown) => {
                    const result = response as { ok?: boolean, data?: BombsState }
                    if (result.ok && result.data?.newBalance !== undefined) {
                        queueBalanceUpdate(result.data.newBalance)
                        flushBalanceUpdate()
                    }
                    currentSocket.disconnect()
                })
                window.setTimeout(() => currentSocket.disconnect(), 120)
                return
            }

            currentSocket.disconnect()
            if (socket !== currentSocket) {
                socket.disconnect()
            }
        }
    }, [flushBalanceUpdate, queueBalanceUpdate])

    useEffect(() => {
        openCellRef.current = openCell
    }, [openCell])

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        let destroyed = false
        const app = new Application()

        const init = async () => {
            await app.init({
                backgroundAlpha: 0,
                antialias: false,
                resizeTo: host
            })

            if (destroyed) {
                app.destroy()
                return
            }

            host.appendChild(app.canvas)

            const runtime: Runtime = {
                app,
                root: new Container(),
                cellsLayer: new Container(),
                hitLayer: new Container(),
                effectsLayer: new Container(),
                resizeObserver: null
            }

            runtime.root.addChild(runtime.cellsLayer, runtime.hitLayer, runtime.effectsLayer)
            app.stage.addChild(runtime.root)
            runtimeRef.current = runtime

            const textures = [
                Config.CLOSED_TILE_TEXTURE,
                Config.EXPLODE_PARTICLE,
                ...Object.values(Config.GOOD_TILES).map(tile => tile.texture),
                ...Object.values(Config.BAD_TILES).map(tile => tile.texture),
                ...Object.values(Config.DEFAULT_TILE).map(tile => tile.texture)
            ]

            await Assets.load(textures.map(pixelAsset))
            Object.values(Config.GOOD_TILES).forEach(tile => new Audio(tile.sound.open).load())
            Object.values(Config.BAD_TILES).forEach(tile => new Audio(tile.sound.open).load())
            Object.values(Config.DEFAULT_TILE).forEach(tile => new Audio(tile.sound.open).load())

            if (destroyed) return

            drawBoardRef.current()
            resizeSceneRef.current()
            runtime.resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => resizeSceneRef.current())
            })
            runtime.resizeObserver.observe(host)
        }

        void init()

        return () => {
            destroyed = true
            const runtime = runtimeRef.current
            runtime?.resizeObserver?.disconnect()
            if (runtime) {
                gsap.killTweensOf(runtime.cellsLayer.children)
                gsap.killTweensOf(runtime.effectsLayer.children)
                gsap.killTweensOf(runtime.cellsLayer)
                runtime.cellsLayer.removeChildren().forEach(child => child.destroy())
                runtime.hitLayer.removeChildren().forEach(child => child.destroy())
                runtime.effectsLayer.removeChildren().forEach(child => child.destroy())
            }
            runtimeRef.current = null
            if (host.contains(app.canvas)) host.removeChild(app.canvas)
            app.destroy(true)
        }
    }, [])

    useEffect(() => {
        drawBoard()
        resizeScene()
    }, [cells, drawBoard, explodedIndex, isActive, resizeScene])

    useEffect(() => {
        updateBoardState()
    }, [isActive, isPending, updateBoardState])

    useImperativeHandle(ref, () => ({ play, cashout }), [cashout, play])

    return (
        <div className={styles.bombs}>
            <div ref={hostRef} className={styles.board} />

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
