import styles from "./MinerField.module.css"
import { MINER_CONFIG } from "@/shared/configs"
import { useEffect, useMemo, useRef } from "react"
import minerBackground from "@/shared/images/games/miner/background.webp"

const MinerField = (props) => {
    const {
        soundEnabled = true,
        roundData,
        isPlaying = false,
        onRoundComplete,
        onAnimationComplete
    } = props

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const rafRef = useRef(null)
    const timersRef = useRef([])
    const assetsRef = useRef(new Map())
    const resizeObserverRef = useRef(null)
    const layoutRef = useRef({ cssW: 0, cssH: 0, scale: 1, offsetX: 0, yBlocks: 0, yChests: 0 })
    const soundEnabledRef = useRef(soundEnabled)
    const onRoundCompleteRef = useRef(onRoundComplete)
    const onAnimationCompleteRef = useRef(onAnimationComplete)

    const {
        ROWS,
        COLS,
        PICKAXE_ROWS,
        CELL_SIZE_PX,
        GRID_GAP_PX,
        BLOCKS,
        PICKAXES,
        CHESTS,
        SLOT_TEXTURE,
        BREAK_TEXTURES = [],
        PICKAXE_FALL_DURATION_MS = 920,
        PICKAXE_FALL_SPINS = 1.45,
        PICKAXE_BOUNCE_DURATION_MS = 420,
        PICKAXE_BOUNCE_HEIGHT_MULT = 2
    } = MINER_CONFIG

    const CHEST_ROW_COUNT = 1
    const PICKAXE_ROW_COUNT = Math.max(1, Number(PICKAXE_ROWS) || 1)
    const SECTION_GAP_PX = 18

    const getWorldMetrics = () => {
        const pickH = PICKAXE_ROW_COUNT * CELL_SIZE_PX + (PICKAXE_ROW_COUNT - 1) * GRID_GAP_PX
        const blocksH = ROWS * CELL_SIZE_PX + (ROWS - 1) * GRID_GAP_PX
        const chestH = CHEST_ROW_COUNT * CELL_SIZE_PX
        const blocksVerticalOffset = (pickH + SECTION_GAP_PX) * 0.15
        const worldH = pickH + SECTION_GAP_PX + blocksVerticalOffset + blocksH + SECTION_GAP_PX + chestH
        return { pickH, blocksH, chestH, blocksVerticalOffset, worldH }
    }

    const demoGrid = useMemo(() => {
        const blockKeys = Object.keys(BLOCKS)
        return Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => blockKeys[(r * COLS + c) % blockKeys.length])
        )
    }, [ROWS, COLS, BLOCKS])

    const demoChests = useMemo(() => (
        Array.from({ length: COLS }, (_, i) => ({
            quality: (i % 4 === 0 ? "common" : i % 4 === 1 ? "uncommon" : i % 4 === 2 ? "rare" : "epic"),
            multiplier: -1
        }))
    ), [COLS])

    const emptySlotPickaxes = useMemo(
        () => Array.from({ length: COLS * PICKAXE_ROW_COUNT }, () => null),
        [COLS, PICKAXE_ROW_COUNT]
    )

    const allPickaxeKeys = useMemo(() => Object.keys(PICKAXES), [PICKAXES])

    const demoPickaxes = useMemo(() => (
        Array.from({ length: COLS * PICKAXE_ROW_COUNT }, (_, i) =>
            allPickaxeKeys.length ? allPickaxeKeys[i % allPickaxeKeys.length] : null
        )
    ), [COLS, PICKAXE_ROW_COUNT, allPickaxeKeys])

    const pickaxesForIdleCanvas = useMemo(() => {
        if (isPlaying && !roundData) return emptySlotPickaxes
        return demoPickaxes
    }, [isPlaying, roundData, emptySlotPickaxes, demoPickaxes])

    const getImage = (src) => {
        if (!src) return null
        const cached = assetsRef.current.get(src)
        if (cached) return cached.img

        const img = new Image()
        img.decoding = "async"
        img.loading = "eager"
        img.src = src

        assetsRef.current.set(src, { img, loaded: false })

        img.onload = () => {
            const entry = assetsRef.current.get(src)
            if (entry) entry.loaded = true

            if (canvasRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                })
            }
        }

        img.onerror = () => {
            assetsRef.current.delete(src)
        }

        return img
    }

    const fitCanvasToContainer = (canvas, worldW, worldH) => {
        const container = containerRef.current
        if (!container) return

        const dpr = window.devicePixelRatio || 1
        const { width: cwRaw, height: chRaw } = container.getBoundingClientRect()
        const cw = Math.max(1, Math.floor(cwRaw))
        const ch = Math.max(1, Math.floor(chRaw))

        canvas.width = Math.floor(cw * dpr)
        canvas.height = Math.floor(ch * dpr)

        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const { pickH, blocksH, chestH, blocksVerticalOffset } = getWorldMetrics()
        const baseH = pickH + SECTION_GAP_PX + blocksVerticalOffset + blocksH + SECTION_GAP_PX + chestH

        const scale = Math.max(0.1, Math.min(cw / worldW, ch / baseH))
        const extraH = ch - baseH * scale
        const extraWorld = extraH > 0 ? (extraH / scale) : 0
        const gap1 = SECTION_GAP_PX + extraWorld / 2
        const gap2 = SECTION_GAP_PX + extraWorld / 2

        const yBlocks = pickH + gap1 + blocksVerticalOffset
        const yChests = yBlocks + blocksH + gap2
        const offsetX = (cw - worldW * scale) / 2

        layoutRef.current = { cssW: cw, cssH: ch, scale, offsetX, yBlocks, yChests }
    }

    const drawPickaxeIcon = (ctx, key, x, y, options = {}) => {
        if (!key) return
        const { rotation = 0, scale = 1, alpha = 1 } = options
        const cfg = PICKAXES?.[key]
        if (!cfg) return

        const tex = getImage(cfg?.TEXTURE)
        const pad = Math.floor(CELL_SIZE_PX * 0.13)
        const cx = x + CELL_SIZE_PX / 2
        const cy = y + CELL_SIZE_PX / 2
        const w = (CELL_SIZE_PX - pad * 2) * scale
        const h = (CELL_SIZE_PX - pad * 2) * scale

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation)
        ctx.globalAlpha = alpha
        if (tex && tex.complete) {
            ctx.drawImage(tex, -w / 2, -h / 2, w, h)
        } else {
            ctx.fillStyle = cfg?.COLOR || "#aaaaaa"
            ctx.fillRect(-w / 2, -h / 2, w, h)
        }
        ctx.restore()
    }

    const drawPickaxeRow = (ctx, pickaxes) => {
        const slotImg = getImage(SLOT_TEXTURE)
        for (let r = 0; r < PICKAXE_ROW_COUNT; r++) {
            const y = r * (CELL_SIZE_PX - 5)
            for (let c = 0; c < COLS; c++) {
                const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
                const slotIndex = r * COLS + c
                const cell = pickaxes?.[slotIndex]
                const isObj = cell && typeof cell === "object"
                const key = isObj ? cell.key : cell
                const mode = isObj ? cell.mode : "static"
                const offset = isObj ? (cell.offset || 0) : 0
                const nextKey = isObj ? cell.nextKey : null
                const bounce = isObj ? (cell.bounce || 0) : 0
                const bounceRot = isObj ? (cell.bounceRot || 0) : 0

                ctx.fillStyle = "rgba(0,0,0,0.25)"
                ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                if (slotImg && slotImg.complete) {
                    ctx.drawImage(slotImg, x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                }

                if (mode === "spin") {
                    const localY = y + offset
                    const spinScale = 0.88

                    ctx.save()
                    ctx.beginPath()
                    ctx.rect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
                    ctx.clip()
                    drawPickaxeIcon(ctx, key, x, localY, { rotation: bounceRot, scale: spinScale })
                    drawPickaxeIcon(ctx, nextKey, x, localY - CELL_SIZE_PX, { rotation: bounceRot, scale: spinScale })
                    ctx.restore()
                } else {
                    drawPickaxeIcon(ctx, key, x, y - bounce, { rotation: bounceRot })
                }

                ctx.strokeStyle = "rgba(0,0,0,0.25)"
                ctx.lineWidth = 2
                ctx.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
            }
        }
    }

    const drawChestRow = (ctx, chests, y) => {

        for (let c = 0; c < COLS; c++) {
            const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
            const chest = chests?.[c]
            const quality = chest?.quality || "common"
            const multiplier = chest?.multiplier
            const isOpened = typeof multiplier === "number" && multiplier !== -1

            const chestCfg = CHESTS?.[quality]

            ctx.fillStyle = chestCfg?.COLOR || "#8b5a2b"
            ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)

            const tex = getImage(chestCfg?.TEXTURE)
            if (tex && tex.complete) {
                ctx.drawImage(tex, x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            }

            ctx.strokeStyle = "rgba(0,0,0,0.35)"
            ctx.lineWidth = 2
            ctx.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)

            if (!isOpened) {
                ctx.fillStyle = "rgba(0,0,0,0.45)"
                ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            } else {
                ctx.fillStyle = "rgba(255,255,255,0.18)"
                ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            }
        }
    }

    const clearAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        if (timersRef.current.length) {
            timersRef.current.forEach(t => clearTimeout(t))
            timersRef.current = []
        }
    }

    const playSound = (src) => {
        if (!soundEnabledRef.current) return
        if (!src) return
        try {
            const audio = new Audio(src)
            audio.volume = 0.5
            audio.play().catch(() => { })
        } catch {
        }
    }

    useEffect(() => {
        soundEnabledRef.current = soundEnabled
    }, [soundEnabled])

    useEffect(() => {
        onRoundCompleteRef.current = onRoundComplete
        onAnimationCompleteRef.current = onAnimationComplete
    }, [onRoundComplete, onAnimationComplete])

    useEffect(() => {
        const preload = async () => {
            const urls = [SLOT_TEXTURE, ...BREAK_TEXTURES].filter(Boolean)
            await Promise.all(urls.map((url) => new Promise((resolve) => {
                const img = getImage(url)
                if (!img) {
                    resolve()
                    return
                }
                if (img.complete) {
                    resolve()
                    return
                }
                img.onload = () => resolve()
                img.onerror = () => resolve()
            })))
        }
        preload()
    }, [SLOT_TEXTURE, BREAK_TEXTURES])

    useEffect(() => {
        if (roundData) return

        const canvas = canvasRef.current
        if (!canvas) return

        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const { worldH } = getWorldMetrics()

        fitCanvasToContainer(canvas, worldW, worldH)

        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect()
            resizeObserverRef.current = null
        }
        resizeObserverRef.current = new ResizeObserver(() => {
            fitCanvasToContainer(canvas, worldW, worldH)

            const ctx = canvas.getContext("2d")
            if (!ctx) return
            drawGrid(demoGrid, demoChests, pickaxesForIdleCanvas, ctx)
        })
        if (containerRef.current) resizeObserverRef.current.observe(containerRef.current)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const drawGrid = (grid, chests, pickaxes, ctx2, overlay) => {
            const { cssW, cssH, scale, offsetX, yBlocks, yChests } = layoutRef.current
            ctx2.clearRect(0, 0, cssW, cssH)
            ctx2.save()
            ctx2.translate(offsetX, 0)
            ctx2.scale(scale, scale)

            drawPickaxeRow(ctx2, pickaxes)

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
                    const y = yBlocks + r * (CELL_SIZE_PX + GRID_GAP_PX)
                    const blockKey = grid?.[r]?.[c]
                    const blockCfg = BLOCKS[blockKey]

                    if (!blockKey) {
                        continue
                    }

                    ctx2.fillStyle = blockCfg?.COLOR || "#808080"
                    ctx2.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)

                    const tex = getImage(blockCfg?.TEXTURE)
                    if (tex && tex.complete) {
                        ctx2.drawImage(tex, x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                    }

                    ctx2.strokeStyle = "rgba(0, 0, 0, 0.2)"
                    ctx2.lineWidth = 2
                    ctx2.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
                }
            }

            drawChestRow(ctx2, chests || demoChests, yChests)

            if (overlay) overlay(ctx2)
            ctx2.restore()
        }

        drawGrid(demoGrid, demoChests, pickaxesForIdleCanvas, ctx)

        return () => {
            clearAnimation()
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
                resizeObserverRef.current = null
            }
        }
    }, [roundData, pickaxesForIdleCanvas, ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, demoGrid, demoChests])

    useEffect(() => {
        if (!roundData) return

        const canvas = canvasRef.current
        if (!canvas) return
        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const { worldH } = getWorldMetrics()
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        fitCanvasToContainer(canvas, worldW, worldH)

        clearAnimation()

        const apiField = roundData?.field
        const apiBlocks = apiField?.Blocks
        const apiPickaxes = apiField?.Pickaxes
        const apiChests = apiField?.Chests

        const normalizeGrid = (gridLike) => {
            if (!Array.isArray(gridLike)) return demoGrid
            const g = Array.from({ length: ROWS }, (_, r) =>
                Array.from({ length: COLS }, (_, c) => {
                    const v = gridLike?.[r]?.[c]
                    if (!v) return null
                    if (typeof v === "string") {
                        const normalized = v.trim()
                        if (!normalized) return null
                        return BLOCKS?.[normalized] ? normalized : null
                    }
                    const candidate = (v?.type || v?.id || v?.key || "").toString().trim()
                    if (!candidate) return null
                    return BLOCKS?.[candidate] ? candidate : null
                })
            )
            return g
        }

        const baseGrid = normalizeGrid(apiBlocks)
        const baseChests = Array.isArray(apiChests) ? apiChests : demoChests
        const totalPickaxeSlots = COLS * PICKAXE_ROW_COUNT
        const normalizePickaxes = (pickaxesLike) => {
            if (!Array.isArray(pickaxesLike)) return []
            if (Array.isArray(pickaxesLike[0])) {
                const rows = pickaxesLike
                return rows.flatMap((row) => (
                    Array.from({ length: COLS }, (_, c) => {
                        const value = row?.[c]
                        if (typeof value !== "string") return null
                        const trimmed = value.trim()
                        return trimmed || null
                    })
                ))
            }
            return pickaxesLike.map((value) => {
                if (typeof value !== "string") return null
                const trimmed = value.trim()
                return trimmed || null
            })
        }

        const pickaxesRaw = normalizePickaxes(apiPickaxes)
        const pickaxes = Array.from({ length: totalPickaxeSlots }, (_, i) => pickaxesRaw[i] ?? null)

        const revealStateRef = { current: null }

        const drawGrid = (grid, chests, overlay) => {
            const { cssW, cssH, scale, offsetX, yBlocks, yChests } = layoutRef.current
            ctx.clearRect(0, 0, cssW, cssH)
            ctx.save()
            ctx.translate(offsetX, 0)
            ctx.scale(scale, scale)

            drawPickaxeRow(ctx, pickaxesToRenderRef.current)

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
                    const y = yBlocks + r * (CELL_SIZE_PX + GRID_GAP_PX)
                    const blockKey = grid?.[r]?.[c]
                    const blockCfg = BLOCKS[blockKey]
                    const reveal = revealStateRef.current
                    const orderBottomFirst = (ROWS - 1 - r) * COLS + c
                    const nowTs = performance.now()

                    if (reveal?.active) {
                        const visibleByTime = Math.floor((nowTs - reveal.start) / reveal.staggerMs)
                        if (orderBottomFirst > visibleByTime) {
                            continue
                        }
                    }

                    if (!blockKey) {
                        continue
                    }

                    const shake = shakesRef.current.get(`${r}:${c}`)
                    let sx = 0
                    let sy = 0
                    if (shake) {
                        const t = Math.min((performance.now() - shake.start) / shake.duration, 1)
                        if (t >= 1) {
                            shakesRef.current.delete(`${r}:${c}`)
                        } else {
                            const amp = shake.amp * (1 - t)
                            sx = Math.sin(t * Math.PI * 10) * amp
                            sy = Math.cos(t * Math.PI * 12) * amp
                        }
                    }

                    let revealAlpha = 1
                    let revealOy = 0
                    if (reveal?.active) {
                        const cellStart = reveal.start + orderBottomFirst * reveal.staggerMs
                        const tCell = Math.min(1, Math.max(0, (nowTs - cellStart) / reveal.popMs))
                        const sm = tCell * tCell * (3 - 2 * tCell)
                        revealAlpha = sm
                        revealOy = -Math.sin(Math.PI * tCell) * reveal.bouncePx
                    }

                    const by = sy + revealOy

                    ctx.save()
                    ctx.globalAlpha *= revealAlpha

                    ctx.fillStyle = blockCfg?.COLOR || "#808080"
                    ctx.fillRect(x + sx, y + by, CELL_SIZE_PX, CELL_SIZE_PX)

                    const tex = getImage(blockCfg?.TEXTURE)
                    if (tex && tex.complete) {
                        ctx.drawImage(tex, x + sx, y + by, CELL_SIZE_PX, CELL_SIZE_PX)
                    }

                    const maxHp = BLOCKS?.[blockKey]?.HEALTH ?? 0
                    const currentHp = blockHp?.[r]?.[c]
                    if (maxHp > 0 && typeof currentHp === "number" && currentHp < maxHp && BREAK_TEXTURES.length > 0) {
                        const lost = maxHp - currentHp
                        const stageIndex = maxHp <= 1
                            ? Math.min(BREAK_TEXTURES.length - 1, lost > 0 ? BREAK_TEXTURES.length - 1 : 0)
                            : Math.min(
                                BREAK_TEXTURES.length - 1,
                                Math.max(0, Math.floor(((lost - 1) / (maxHp - 1)) * (BREAK_TEXTURES.length - 1)))
                            )
                        const breakOverlay = getImage(BREAK_TEXTURES[stageIndex])
                        if (breakOverlay && breakOverlay.complete) {
                            ctx.save()
                            ctx.globalAlpha *= 0.82
                            ctx.imageSmoothingEnabled = false
                            ctx.drawImage(breakOverlay, x + sx, y + by, CELL_SIZE_PX, CELL_SIZE_PX)
                            ctx.restore()
                        }
                    }

                    ctx.strokeStyle = "rgba(0,0,0,0.35)"
                    ctx.lineWidth = 2
                    ctx.strokeRect(x + sx + 1, y + by + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
                    ctx.restore()
                }
            }

            drawChestRow(ctx, chests || demoChests, yChests)

            if (overlay) overlay(ctx)
            ctx.restore()
        }

        const winFromServer = Number(roundData?.winAmount ?? roundData?.win ?? roundData?.payout ?? 0) || 0

        const shakesRef = { current: new Map() }
        const particlesRef = { current: [] }
        let lastParticleTs = performance.now()

        const updateAndDrawParticles = (ctx2) => {
            const now = performance.now()
            const dt = Math.min((now - lastParticleTs) / 1000, 0.05)
            lastParticleTs = now

            const parts = particlesRef.current
            for (let i = parts.length - 1; i >= 0; i--) {
                const p = parts[i]
                p.life -= dt
                if (p.life <= 0) {
                    parts.splice(i, 1)
                    continue
                }
                p.vy += 900 * dt
                p.x += p.vx * dt
                p.y += p.vy * dt
            }

            if (!parts.length) return

            ctx2.save()
            for (const p of parts) {
                ctx2.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife))
                ctx2.fillStyle = p.color
                ctx2.fillRect(p.x, p.y, p.size, p.size)
            }
            ctx2.restore()
        }

        const spawnBreakParticles = (row, col, color) => {
            const { yBlocks } = layoutRef.current
            const x0 = col * (CELL_SIZE_PX + GRID_GAP_PX) + CELL_SIZE_PX / 2
            const y0 = yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX) + CELL_SIZE_PX / 2
            const count = 12
            for (let i = 0; i < count; i++) {
                const a = (Math.PI * 2 * i) / count + Math.random() * 0.35
                const sp = 180 + Math.random() * 220
                const size = 3 + Math.random() * 3
                particlesRef.current.push({
                    x: x0,
                    y: y0,
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp - 120,
                    life: 0.55 + Math.random() * 0.25,
                    maxLife: 0.8,
                    color: color || "#808080",
                    size
                })
            }
        }

        const spawnPickaxeBreakParticles = (col, yWorld, color) => {
            const x0 = col * (CELL_SIZE_PX + GRID_GAP_PX) + CELL_SIZE_PX / 2
            const y0 = yWorld + CELL_SIZE_PX / 2
            const count = 10
            for (let i = 0; i < count; i++) {
                const a = (Math.PI * 2 * i) / count + Math.random() * 0.45
                const sp = 160 + Math.random() * 160
                const size = 8 + Math.random() * 7
                particlesRef.current.push({
                    x: x0,
                    y: y0,
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp - 100,
                    life: 0.6 + Math.random() * 0.25,
                    maxLife: 0.9,
                    color: color || "#cfcfcf",
                    size
                })
            }
        }

        const pickaxeKeys = Object.keys(PICKAXES)
        const pickaxesToRenderRef = {
            current: Array.from({ length: totalPickaxeSlots }, (_, i) => ({
                mode: "static",
                key: pickaxeKeys[i % Math.max(1, pickaxeKeys.length)] || null,
                nextKey: pickaxeKeys[(i + 1) % Math.max(1, pickaxeKeys.length)] || null,
                offset: 0,
                bounce: 0,
                bounceRot: 0
            }))
        }

        const runReveal = () => new Promise((resolve) => {
            const deadline = performance.now() + 1400
            const tick = (now) => {
                drawGrid(currentGrid, currentChests, (g) => {
                    updateAndDrawParticles(g)
                })
                if (particlesRef.current.length === 0 || now >= deadline) {
                    particlesRef.current = []
                    drawGrid(currentGrid, currentChests)
                    if (onRoundCompleteRef.current) onRoundCompleteRef.current({ winAmount: winFromServer })
                    resolve()
                    return
                }
                rafRef.current = requestAnimationFrame(tick)
            }
            rafRef.current = requestAnimationFrame(tick)
        })

        const runInitialBlocksReveal = () => new Promise((resolve) => {
            const staggerMs = 38
            const popMs = 220
            const bouncePx = 9
            revealStateRef.current = {
                active: true,
                start: performance.now(),
                staggerMs,
                popMs,
                bouncePx
            }
            const totalCells = ROWS * COLS
            const endAfter = (totalCells - 1) * staggerMs + popMs + 100

            const tick = (now) => {
                drawGrid(currentGrid, currentChests, (g) => {
                    updateAndDrawParticles(g)
                })
                if (now - revealStateRef.current.start < endAfter) {
                    rafRef.current = requestAnimationFrame(tick)
                    return
                }
                revealStateRef.current = null
                drawGrid(currentGrid, currentChests)
                resolve()
            }
            rafRef.current = requestAnimationFrame(tick)
        })

        const currentGrid = baseGrid.map(row => row.slice())
        const currentChests = baseChests.map(c => ({ ...c }))

        const openChestStep = (col) => {
            const chest = currentChests?.[col]
            const quality = chest?.quality || "common"
            const multiplier = chest?.multiplier
            const isOpened = typeof multiplier === "number" && multiplier !== -1
            if (!isOpened) return
            playSound(CHESTS?.[quality]?.OPEN_SOUND)
            drawGrid(currentGrid, currentChests, (g) => {
                const x = col * (CELL_SIZE_PX + GRID_GAP_PX)
                const y = layoutRef.current.yChests
                g.fillStyle = "rgba(255,255,255,0.22)"
                g.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            })
        }

        const blockHp = Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
                const key = currentGrid?.[r]?.[c]
                return key ? (BLOCKS?.[key]?.HEALTH ?? 1) : 0
            })
        )

        const pickaxeHp = Array.from({ length: totalPickaxeSlots }, (_, i) => {
            const key = pickaxes?.[i]
            return key ? (PICKAXES?.[key]?.HEALTH ?? 1) : 0
        })

        const fallOverlayRef = { current: null }

        const drawWithOverlay = () => {
            drawGrid(currentGrid, currentChests, (g) => {
                const ov = fallOverlayRef.current
                if (ov) {
                    const x = ov.col * (CELL_SIZE_PX + GRID_GAP_PX)
                    const y = ov.yWorld
                    drawPickaxeIcon(g, ov.pickaxeKey, x, y, {
                        rotation: ov.angle || 0,
                        scale: 1
                    })
                }
                updateAndDrawParticles(g)
            })
        }

        const animateParticlesFor = (durationMs = 180) => new Promise((resolve) => {
            const start = performance.now()
            const tick = (now) => {
                drawWithOverlay()
                if (now - start >= durationMs || particlesRef.current.length === 0) {
                    resolve()
                    return
                }
                rafRef.current = requestAnimationFrame(tick)
            }
            rafRef.current = requestAnimationFrame(tick)
        })

        const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)

        const animateFall = (col, fromY, toY, pickaxeKey, durationMs = PICKAXE_FALL_DURATION_MS, spins = PICKAXE_FALL_SPINS) => new Promise((resolve) => {
            const start = performance.now()
            const tick = (now) => {
                const t = Math.min((now - start) / durationMs, 1)
                const y = fromY + (toY - fromY) * easeOutQuad(t)
                const angle = t * Math.PI * 2 * spins
                fallOverlayRef.current = { col, yWorld: y, pickaxeKey, angle }
                drawWithOverlay()
                if (t < 1) {
                    rafRef.current = requestAnimationFrame(tick)
                } else {
                    resolve(angle)
                }
            }
            rafRef.current = requestAnimationFrame(tick)
        })

        const animatePickaxeBounce = (col, yBase, pickaxeKey, angleBase = 0) => new Promise((resolve) => {
            const duration = PICKAXE_BOUNCE_DURATION_MS
            const baseJump = Math.max(34, CELL_SIZE_PX * 0.72)
            const jump = baseJump * PICKAXE_BOUNCE_HEIGHT_MULT
            const start = performance.now()
            const tick = (now) => {
                const t = Math.min((now - start) / duration, 1)
                const lift = Math.sin(t * Math.PI)
                const y = yBase - lift * jump
                const extraSpin = lift * Math.PI * 2
                const angle = angleBase + extraSpin
                fallOverlayRef.current = { col, yWorld: y, pickaxeKey, angle }
                drawWithOverlay()
                if (t < 1) {
                    rafRef.current = requestAnimationFrame(tick)
                } else {
                    resolve(angleBase + Math.PI * 2)
                }
            }
            rafRef.current = requestAnimationFrame(tick)
        })

        const hitFlash = (row, col, broke) => {
            drawGrid(currentGrid, currentChests, (g) => {
                const { yBlocks } = layoutRef.current
                const x = col * (CELL_SIZE_PX + GRID_GAP_PX)
                const y = yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX)
                g.fillStyle = "rgba(255,255,255,0.18)"
                g.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                updateAndDrawParticles(g)
            })

            const shakeDuration = 240
            const shakeAmp = broke ? 3 : 5
            shakesRef.current.set(`${row}:${col}`, { start: performance.now(), duration: shakeDuration, amp: shakeAmp })

            timersRef.current.push(setTimeout(() => {
                drawGrid(currentGrid, currentChests, (g) => {
                    updateAndDrawParticles(g)
                })
            }, shakeDuration + 20))
        }

        const chestOpened = Array.from({ length: COLS }, () => false)

        const runPickaxeFromSlot = async (slotIndex) => {
            const col = slotIndex % COLS
            const pickaxeKey = pickaxes?.[slotIndex]
            if (typeof pickaxeKey === "string" && pickaxeKey.trim() === "") return
            if (!pickaxeKey) return

            let hp = pickaxeHp[slotIndex]
            if (hp <= 0) return

            const slotRow = Math.floor(slotIndex / COLS)
            let currentY = slotRow * (CELL_SIZE_PX + GRID_GAP_PX)
            let spinAngle = 0
            pickaxesToRenderRef.current[slotIndex] = null

            for (let row = 0; row < ROWS; row++) {
                const blockKey = currentGrid?.[row]?.[col]
                if (!blockKey) continue

                const targetY = layoutRef.current.yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX) - CELL_SIZE_PX * 0.55
                spinAngle = await animateFall(col, currentY, targetY, pickaxeKey)
                currentY = targetY

                const blockCfg = BLOCKS?.[blockKey]
                const baseDamage = Math.max(1, Math.ceil((blockCfg?.HEALTH || 1) / 3))

                while (hp > 0 && blockHp[row][col] > 0) {
                    playSound(blockCfg?.HIT_SOUND)
                    const willBreakBlock = blockHp[row][col] - baseDamage <= 0
                    const willBreakPick = hp - Math.min(hp, baseDamage, blockHp[row][col]) <= 0
                    hitFlash(row, col, willBreakBlock)

                    const damage = Math.min(hp, baseDamage, blockHp[row][col])
                    hp -= damage
                    blockHp[row][col] -= damage

                    const blockDestroyed = blockHp[row][col] <= 0
                    const pickaxeDestroyed = hp <= 0

                    if (blockDestroyed) {
                        playSound(blockCfg?.BREAK_SOUND)
                        spawnBreakParticles(row, col, blockCfg?.COLOR)
                        currentGrid[row][col] = null
                        drawWithOverlay()
                    }

                    if (pickaxeDestroyed) {
                        playSound(PICKAXES?.[pickaxeKey]?.BREAK_SOUND)
                        spawnPickaxeBreakParticles(col, currentY, PICKAXES?.[pickaxeKey]?.COLOR)
                        drawWithOverlay()
                        await animateParticlesFor(260)
                    }

                    if (blockDestroyed || pickaxeDestroyed) {
                        break
                    }

                    spinAngle = await animatePickaxeBounce(col, currentY, pickaxeKey, spinAngle)
                    await new Promise(r => timersRef.current.push(setTimeout(r, 80)))
                }

                if (hp <= 0) break

                await new Promise(r => timersRef.current.push(setTimeout(r, 120)))
            }

            fallOverlayRef.current = null
            drawWithOverlay()

            const columnCleared = Array.from({ length: ROWS }, (_, r) => !currentGrid?.[r]?.[col]).every(Boolean)
            const chestMult = currentChests?.[col]?.multiplier
            if (!chestOpened[col] && columnCleared && typeof chestMult === "number" && chestMult !== -1) {
                chestOpened[col] = true
                openChestStep(col)
                await new Promise(r => timersRef.current.push(setTimeout(r, 180)))
            }
        }

        const runAll = async () => {
            for (let slotIndex = 0; slotIndex < totalPickaxeSlots; slotIndex++) {
                await runPickaxeFromSlot(slotIndex)
            }
        }

        const finishRoundVisuals = async () => {
            try {
                await runAll()
                await runReveal()
            } finally {
                if (onAnimationCompleteRef.current) onAnimationCompleteRef.current()
            }
        }

        const afterSpinDelayMs = 240

        const spinStart = performance.now()
        let lastSpinTs = spinStart
        const spinBaseMs = 1200
        const stopStaggerMs = 220
        const stopTimes = Array.from({ length: totalPickaxeSlots }, (_, i) => spinStart + spinBaseMs + i * stopStaggerMs)
        const stopped = Array.from({ length: totalPickaxeSlots }, () => false)
        const bounceState = Array.from({ length: totalPickaxeSlots }, () => ({ start: 0, duration: 260 }))
        const stoppedCount = { value: 0 }

        const animateSpin = (now) => {
            const dt = Math.min((now - lastSpinTs) / 1000, 0.05)
            lastSpinTs = now

            for (let slotIndex = 0; slotIndex < totalPickaxeSlots; slotIndex++) {
                const target = pickaxes?.[slotIndex] ?? null
                const slot = pickaxesToRenderRef.current[slotIndex]
                if (stopped[slotIndex]) {
                    const b = bounceState[slotIndex]
                    let bounce = 0
                    if (b.start > 0) {
                        const t = Math.min((now - b.start) / b.duration, 1)
                        const amp = Math.max(10, CELL_SIZE_PX * 0.16)
                        bounce = (t >= 1 ? 0 : Math.sin(t * Math.PI)) * amp
                    }
                    pickaxesToRenderRef.current[slotIndex] = {
                        mode: "static",
                        key: target,
                        nextKey: null,
                        offset: 0,
                        bounce,
                        bounceRot: 0
                    }
                    continue
                }

                const shouldStop = now >= stopTimes[slotIndex]

                if (!slot || slot.mode !== "spin") {
                    const first = pickaxeKeys[(slotIndex + Math.floor(Math.random() * pickaxeKeys.length)) % pickaxeKeys.length] || null
                    const next = pickaxeKeys[(slotIndex + 1 + Math.floor(Math.random() * pickaxeKeys.length)) % pickaxeKeys.length] || null
                    pickaxesToRenderRef.current[slotIndex] = { mode: "spin", key: first, nextKey: next, offset: 0, bounce: 0, bounceRot: 0 }
                }

                const s = pickaxesToRenderRef.current[slotIndex]
                const speedPx = Math.max(110, 320 - slotIndex * 10)
                s.offset += speedPx * dt
                while (s.offset >= CELL_SIZE_PX) {
                    s.offset -= CELL_SIZE_PX
                    s.key = s.nextKey
                    s.nextKey = pickaxeKeys[Math.floor(Math.random() * pickaxeKeys.length)] || null
                }

                if (shouldStop) {
                    stopped[slotIndex] = true
                    stoppedCount.value += 1
                    bounceState[slotIndex].start = now
                    pickaxesToRenderRef.current[slotIndex] = {
                        mode: "static",
                        key: target,
                        nextKey: null,
                        offset: 0,
                        bounce: 0,
                        bounceRot: 0
                    }
                }
            }

            drawGrid(currentGrid, currentChests, (g) => {
                updateAndDrawParticles(g)
            })

            if (stoppedCount.value < totalPickaxeSlots) {
                rafRef.current = requestAnimationFrame(animateSpin)
                return
            }

            const bouncesPending = bounceState.some((b) => b.start > 0 && now < b.start + b.duration)
            if (bouncesPending) {
                rafRef.current = requestAnimationFrame(animateSpin)
                return
            }

            drawGrid(currentGrid, currentChests)

            timersRef.current.push(setTimeout(() => {
                finishRoundVisuals()
            }, afterSpinDelayMs))
        }

        const startSpinWithIntro = async () => {
            await runInitialBlocksReveal()
            rafRef.current = requestAnimationFrame(animateSpin)
        }

        startSpinWithIntro()
    }, [roundData, ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, CHESTS, BREAK_TEXTURES, SLOT_TEXTURE, demoGrid, demoChests])

    return (
        <div
            ref={containerRef}
            className={styles["miner-game"]}
            style={{ "--miner-bg": `url(${minerBackground})` }}
        >
            <canvas ref={canvasRef} aria-label="miner field canvas" />
        </div>
    )
}

export default MinerField