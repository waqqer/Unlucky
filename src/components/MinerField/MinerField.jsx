import styles from "./MinerField.module.css"
import { MINER_CONFIG } from "@/shared/configs"
import { useEffect, useMemo, useRef } from "react"

const MinerField = (props) => {
    const {
        soundEnabled = true,
        roundData,
        onRoundComplete
    } = props

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const rafRef = useRef(null)
    const timersRef = useRef([])
    const assetsRef = useRef(new Map())
    const resizeObserverRef = useRef(null)
    const layoutRef = useRef({ cssW: 0, cssH: 0, scale: 1, offsetX: 0, yBlocks: 0, yChests: 0 })

    const {
        ROWS,
        COLS,
        CELL_SIZE_PX,
        GRID_GAP_PX,
        BLOCKS,
        PICKAXES,
        CHESTS,
        SLOT_TEXTURE
    } = MINER_CONFIG

    const CHEST_ROW_COUNT = 1
    const PICKAXE_ROW_COUNT = 1
    const SECTION_GAP_PX = 18

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

        const pickH = PICKAXE_ROW_COUNT * CELL_SIZE_PX
        const blocksH = ROWS * CELL_SIZE_PX + (ROWS - 1) * GRID_GAP_PX
        const chestH = CHEST_ROW_COUNT * CELL_SIZE_PX
        const baseH = pickH + SECTION_GAP_PX + blocksH + SECTION_GAP_PX + chestH

        const scale = Math.max(0.1, Math.min(cw / worldW, ch / baseH))
        const extraH = ch - baseH * scale
        const extraWorld = extraH > 0 ? (extraH / scale) : 0
        const gap1 = SECTION_GAP_PX + extraWorld / 2
        const gap2 = SECTION_GAP_PX + extraWorld / 2

        const yBlocks = pickH + gap1
        const yChests = yBlocks + blocksH + gap2
        const offsetX = (cw - worldW * scale) / 2

        layoutRef.current = { cssW: cw, cssH: ch, scale, offsetX, yBlocks, yChests }
    }

    const drawPickaxeRow = (ctx, pickaxes) => {
        const slotImg = getImage(SLOT_TEXTURE)
        const y = 0

        for (let c = 0; c < COLS; c++) {
            const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
            const key = pickaxes?.[c]
            const cfg = key ? PICKAXES?.[key] : null

            ctx.fillStyle = "rgba(0,0,0,0.25)"
            ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            if (slotImg && slotImg.complete) {
                ctx.drawImage(slotImg, x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            }

            if (cfg) {
                const tex = getImage(cfg?.TEXTURE)
                if (tex && tex.complete) {
                    const pad = Math.floor(CELL_SIZE_PX * 0.12)
                    ctx.drawImage(tex, x + pad, y + pad, CELL_SIZE_PX - pad * 2, CELL_SIZE_PX - pad * 2)
                } else {
                    ctx.fillStyle = cfg?.COLOR || "#aaaaaa"
                    ctx.fillRect(x + 10, y + 10, CELL_SIZE_PX - 20, CELL_SIZE_PX - 20)
                }
            }

            ctx.strokeStyle = "rgba(0,0,0,0.25)"
            ctx.lineWidth = 2
            ctx.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
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
        if (!soundEnabled) return
        if (!src) return
        try {
            const audio = new Audio(src)
            audio.volume = 0.5
            audio.play().catch(() => { })
        } catch {
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const worldH =
            (PICKAXE_ROW_COUNT + ROWS + CHEST_ROW_COUNT) * CELL_SIZE_PX +
            (ROWS + CHEST_ROW_COUNT - 1) * GRID_GAP_PX +
            SECTION_GAP_PX * 2

        fitCanvasToContainer(canvas, worldW, worldH)

        const demoPickaxes = Object.keys(PICKAXES).slice(0, COLS)

        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect()
            resizeObserverRef.current = null
        }
        resizeObserverRef.current = new ResizeObserver(() => {
            fitCanvasToContainer(canvas, worldW, worldH)

            const ctx = canvas.getContext("2d")
            if (!ctx) return
            drawGrid(demoGrid, demoChests, demoPickaxes, ctx)
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
                        ctx2.fillStyle = "rgba(0, 0, 0, 0)"
                        ctx2.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                        ctx2.strokeStyle = "rgba(0, 0, 0, 0)"
                        ctx2.lineWidth = 2
                        ctx2.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
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

        drawGrid(demoGrid, demoChests, demoPickaxes, ctx)

        return () => {
            clearAnimation()
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
                resizeObserverRef.current = null
            }
        }
    }, [ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, demoGrid, demoChests])

    useEffect(() => {
        if (!roundData) return

        const canvas = canvasRef.current
        if (!canvas) return
        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const worldH =
            (PICKAXE_ROW_COUNT + ROWS + CHEST_ROW_COUNT) * CELL_SIZE_PX +
            (ROWS + CHEST_ROW_COUNT - 1) * GRID_GAP_PX +
            SECTION_GAP_PX * 2
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
                    if (typeof v === "string") return v
                    return v?.type || v?.id || v?.key || null
                })
            )
            return g
        }

        const baseGrid = normalizeGrid(apiBlocks)
        const baseChests = Array.isArray(apiChests) ? apiChests : demoChests
        const pickaxes = Array.isArray(apiPickaxes)
            ? apiPickaxes.map(p => (typeof p === "string" && p.trim() === "" ? null : p))
            : []

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

                    if (!blockKey) {
                        ctx.fillStyle = "rgba(58, 63, 58, 0.35)"
                        ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                        ctx.strokeStyle = "rgba(0,0,0,0.25)"
                        ctx.lineWidth = 2
                        ctx.strokeRect(x + 1, y + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
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

                    ctx.fillStyle = blockCfg?.COLOR || "#808080"
                    ctx.fillRect(x + sx, y + sy, CELL_SIZE_PX, CELL_SIZE_PX)

                    const tex = getImage(blockCfg?.TEXTURE)
                    if (tex && tex.complete) {
                        ctx.drawImage(tex, x + sx, y + sy, CELL_SIZE_PX, CELL_SIZE_PX)
                    }

                    ctx.strokeStyle = "rgba(0,0,0,0.35)"
                    ctx.lineWidth = 2
                    ctx.strokeRect(x + sx + 1, y + sy + 1, CELL_SIZE_PX - 2, CELL_SIZE_PX - 2)
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

        const pickaxeKeys = Object.keys(PICKAXES)
        const pickaxesToRenderRef = { current: Array.from({ length: COLS }, () => null) }
        const spinStart = performance.now()
        const spinBaseMs = 900
        const stopStaggerMs = 140
        const finalStopMs = spinBaseMs + stopStaggerMs * (COLS - 1)

        const spinSymbolAt = (now, col) => {
            const stopAt = spinStart + spinBaseMs + col * stopStaggerMs
            if (now >= stopAt) return pickaxes?.[col] ?? null
            const speed = 70 + col * 8
            const idx = Math.floor((now - spinStart) / speed + col * 3) % pickaxeKeys.length
            return pickaxeKeys[idx]
        }

        const runReveal = () => {
            const start = performance.now()
            const duration = 900

            const tick = (t) => {
                const p = Math.min((t - start) / duration, 1)
                drawGrid(baseGrid, baseChests, (g) => {
                    const { cssW, cssH, scale } = layoutRef.current
                    g.fillStyle = `rgba(255,255,255,${0.12 * (1 - p)})`
                    g.fillRect(0, 0, cssW / scale, cssH / scale)
                })

                if (p < 1) {
                    rafRef.current = requestAnimationFrame(tick)
                    return
                }

                if (onRoundComplete) onRoundComplete({ winAmount: winFromServer })
            }

            rafRef.current = requestAnimationFrame(tick)
        }

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
                const y =
                    PICKAXE_ROW_COUNT * CELL_SIZE_PX +
                    SECTION_GAP_PX +
                    ROWS * (CELL_SIZE_PX + GRID_GAP_PX)
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

        const pickaxeHp = Array.from({ length: COLS }, (_, c) => {
            const key = pickaxes?.[c]
            return key ? (PICKAXES?.[key]?.HEALTH ?? 1) : 0
        })

        const fallOverlayRef = { current: null }

        const drawWithOverlay = () => {
            drawGrid(currentGrid, currentChests, (g) => {
                const ov = fallOverlayRef.current
                if (!ov) return
                const x = ov.col * (CELL_SIZE_PX + GRID_GAP_PX)
                const y = ov.yWorld

                const cfg = PICKAXES?.[ov.pickaxeKey]
                const tex = getImage(cfg?.TEXTURE)
                const pad = Math.floor(CELL_SIZE_PX * 0.12)

                g.save()
                g.globalAlpha = 0.98
                if (tex && tex.complete) {
                    g.drawImage(tex, x + pad, y + pad, CELL_SIZE_PX - pad * 2, CELL_SIZE_PX - pad * 2)
                } else {
                    g.fillStyle = cfg?.COLOR || "#aaaaaa"
                    g.fillRect(x + pad, y + pad, CELL_SIZE_PX - pad * 2, CELL_SIZE_PX - pad * 2)
                }
                g.restore()
            }, (g) => {
                updateAndDrawParticles(g)
            })
        }

        const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)

        const animateFall = (col, fromY, toY, pickaxeKey, durationMs = 320) => new Promise((resolve) => {
            const start = performance.now()
            const tick = (now) => {
                const t = Math.min((now - start) / durationMs, 1)
                const y = fromY + (toY - fromY) * easeOutQuad(t)
                fallOverlayRef.current = { col, yWorld: y, pickaxeKey }
                drawWithOverlay()
                if (t < 1) {
                    rafRef.current = requestAnimationFrame(tick)
                } else {
                    resolve()
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

            if (!broke) {
                shakesRef.current.set(`${row}:${col}`, { start: performance.now(), duration: 220, amp: 4 })
            }
        }

        const runColumn = async (col) => {
            const pickaxeKey = pickaxes?.[col]
            if (typeof pickaxeKey === "string" && pickaxeKey.trim() === "") return
            if (!pickaxeKey) return

            let hp = pickaxeHp[col]
            if (hp <= 0) return

            let currentY = 0
            pickaxesToRenderRef.current[col] = null

            for (let row = 0; row < ROWS; row++) {
                const blockKey = currentGrid?.[row]?.[col]
                if (!blockKey) continue

                const targetY = layoutRef.current.yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX)
                await animateFall(col, currentY, targetY, pickaxeKey, 260)
                currentY = targetY

                const blockCfg = BLOCKS?.[blockKey]
                playSound(blockCfg?.HIT_SOUND)
                const willBreak = hp >= blockHp[row][col]
                hitFlash(row, col, willBreak)

                const damage = Math.min(hp, blockHp[row][col])
                hp -= damage
                blockHp[row][col] -= damage

                if (blockHp[row][col] <= 0) {
                    playSound(blockCfg?.BREAK_SOUND)
                    spawnBreakParticles(row, col, blockCfg?.COLOR)
                    currentGrid[row][col] = null
                    drawWithOverlay()
                }

                if (hp <= 0) {
                    playSound(PICKAXES?.[pickaxeKey]?.BREAK_SOUND)
                    break
                }

                await new Promise(r => timersRef.current.push(setTimeout(r, 120)))
            }

            fallOverlayRef.current = null
            drawGrid(currentGrid, currentChests)

            const columnCleared = Array.from({ length: ROWS }, (_, r) => !currentGrid?.[r]?.[col]).every(Boolean)
            const chestMult = currentChests?.[col]?.multiplier
            if (columnCleared && typeof chestMult === "number" && chestMult !== -1) {
                openChestStep(col)
                await new Promise(r => timersRef.current.push(setTimeout(r, 180)))
            }
        }

        const runAll = async () => {
            for (let col = 0; col < COLS; col++) {
                await runColumn(col)
            }
            if (onRoundComplete) onRoundComplete({ winAmount: winFromServer })
        }

        const afterSpinDelayMs = 240

        const animateSpin = (now) => {
            for (let col = 0; col < COLS; col++) {
                pickaxesToRenderRef.current[col] = spinSymbolAt(now, col)
            }

            drawGrid(currentGrid, currentChests, (g) => {
                updateAndDrawParticles(g)
            })

            if (now - spinStart < finalStopMs) {
                rafRef.current = requestAnimationFrame(animateSpin)
                return
            }

            for (let col = 0; col < COLS; col++) {
                pickaxesToRenderRef.current[col] = pickaxes?.[col] ?? null
            }
            drawGrid(currentGrid, currentChests)

            timersRef.current.push(setTimeout(() => {
                runAll()
            }, afterSpinDelayMs))
        }

        rafRef.current = requestAnimationFrame(animateSpin)
    }, [roundData, soundEnabled, onRoundComplete, ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, CHESTS, demoGrid, demoChests])

    return (
        <div ref={containerRef} className={styles["miner-game"]}>
            <canvas ref={canvasRef} aria-label="miner field canvas" />
        </div>
    )
}

export default MinerField