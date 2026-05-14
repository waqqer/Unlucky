import styles from "./MinerField.module.css"
import { MINER_CONFIG } from "@/shared/configs"
import { memo, useEffect, useMemo, useRef } from "react"
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
    const layoutRef = useRef({ cssW: 0, cssH: 0, scale: 1, offsetX: 0, yBlocks: 0, yChests: 0 })
    const soundEnabledRef = useRef(soundEnabled)
    const onRoundCompleteRef = useRef(onRoundComplete)
    const onAnimationCompleteRef = useRef(onAnimationComplete)
    const idleRafRef = useRef(null)
    const audioPoolsRef = useRef(new Map())
    const suppressSoundRef = useRef(false)
    const glowTintScratchRef = useRef(null)
    const chestBounceT0Ref = useRef(new Map())
    const chestLabelShownRef = useRef(new Set())
    const pickaxeFallRafIdsRef = useRef(new Set())
    const minerRouletteAudioRef = useRef(null)
    const roundCanvasRedrawRef = useRef(null)
    const idleCanvasRedrawRef = useRef(null)

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
        PICKAXE_BOUNCE_HEIGHT_MULT = 1.05,
        PICKAXE_ROW_PAUSE_MS = 260,
        PICKAXE_RECOIL_AFTER_BREAK_MS = 130,
        PICKAXE_RECOIL_JUMP_MULT = 0.4,
        PICKAXE_RECOIL_SPIN_TURNS = 0.22,
        PICKAXE_BETWEEN_HIT_DELAY_MS = 10,
        MINER_SOUND_VOLUME = 0.28,
        MINER_PICKAXE_ROULETE_SOUND = null,
        CHEST_GLOW_PARTICLE_DEFAULTS = {}
    } = MINER_CONFIG

    const soundVolumeRef = useRef(MINER_SOUND_VOLUME)

    const chestGlowParticleParams = (chestCfg) => {
        const d = CHEST_GLOW_PARTICLE_DEFAULTS || {}
        const num = (v, fallback) => {
            const x = Number(v)
            return Number.isFinite(x) ? x : fallback
        }
        const c = chestCfg || {}
        return {
            spawnInterval: num(c.GLOW_SPAWN_INTERVAL_SEC, num(d.SPAWN_INTERVAL_SEC, 0.065)),
            cellPadMult: num(c.GLOW_CELL_PADDING_MULT, num(d.CELL_PADDING_MULT, 0.1)),
            speedMin: num(c.GLOW_SPEED_MIN, num(d.SPEED_MIN, 28)),
            speedRandom: num(c.GLOW_SPEED_RANDOM, num(d.SPEED_RANDOM, 52)),
            lifeBase: num(c.GLOW_LIFE_BASE_SEC, num(d.LIFE_BASE_SEC, 0.72)),
            lifeRandom: num(c.GLOW_LIFE_RANDOM_SEC, num(d.LIFE_RANDOM_SEC, 0.48)),
            lifeDistBase: num(c.GLOW_LIFE_DIST_BASE, num(d.LIFE_DIST_BASE, 0.72)),
            lifeDistScale: num(c.GLOW_LIFE_DIST_SCALE, num(d.LIFE_DIST_SCALE, 0.22)),
            lifeDistCap: num(c.GLOW_LIFE_DIST_CAP, num(d.LIFE_DIST_CAP, 1.45)),
            sizeMin: num(c.GLOW_SIZE_MIN_PX, num(d.SIZE_MIN_PX, 7)),
            sizeRandom: num(c.GLOW_SIZE_RANDOM_PX, num(d.SIZE_RANDOM_PX, 11)),
            drag: Math.min(0.9995, Math.max(0.9, num(c.GLOW_DRAG, num(d.DRAG, 0.987)))),
            speedMulDefault: num(c.GLOW_SPEED_MUL_DEFAULT, num(d.SPEED_MUL_DEFAULT, 0.5)),
            distMulDefault: num(c.GLOW_DISTANCE_MUL_DEFAULT, num(d.DIST_MUL_DEFAULT, 1.75))
        }
    }

    useEffect(() => {
        const v = Math.min(1, Math.max(0, Number(MINER_SOUND_VOLUME) || 0))
        soundVolumeRef.current = v
        audioPoolsRef.current.forEach((pool) => {
            pool.forEach((a) => {
                a.volume = v
            })
        })
        const loop = minerRouletteAudioRef.current
        if (loop) loop.volume = v
    }, [MINER_SOUND_VOLUME])

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

    const drawTintedGlowSprite = (ctx2, tex, px, py, s, tint, globalAlpha) => {
        if (!tex?.complete) return
        if (!tint) {
            ctx2.save()
            ctx2.globalAlpha = globalAlpha * 0.92
            ctx2.drawImage(tex, px - s / 2, py - s / 2, s, s)
            ctx2.restore()
            return
        }
        const pad = 2
        const n = Math.max(64, Math.ceil(s + pad))
        let c = glowTintScratchRef.current
        if (!c) {
            c = document.createElement("canvas")
            glowTintScratchRef.current = c
        }
        if (c.width < n || c.height < n) {
            c.width = n
            c.height = n
        }
        const sc = c.getContext("2d", { willReadFrequently: false })
        if (!sc) return
        sc.setTransform(1, 0, 0, 1, 0, 0)
        sc.clearRect(0, 0, n, n)
        sc.imageSmoothingEnabled = true
        sc.globalCompositeOperation = "source-over"
        sc.drawImage(tex, 0, 0, s, s)
        sc.globalCompositeOperation = "multiply"
        sc.fillStyle = tint
        sc.fillRect(0, 0, s, s)
        sc.globalCompositeOperation = "destination-in"
        sc.drawImage(tex, 0, 0, s, s)
        sc.globalCompositeOperation = "source-over"
        const hw = s / 2
        ctx2.save()
        ctx2.globalAlpha = globalAlpha * 0.92
        ctx2.drawImage(c, 0, 0, s, s, px - hw, py - hw, s, s)
        ctx2.restore()
    }

    const drawChestGlowParticle = (ctx2, p) => {
        const tex = getImage(p.texSrc)
        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife))
        const s = p.size
        if (tex?.complete) {
            drawTintedGlowSprite(ctx2, tex, p.x, p.y, s, p.tint, alpha)
            return
        }
        ctx2.save()
        ctx2.globalAlpha = alpha * 0.88
        const r = Math.max(1.5, s * 0.48)
        const g = ctx2.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        const core = p.tint || "#ffffff"
        g.addColorStop(0, core)
        g.addColorStop(0.5, core)
        g.addColorStop(1, "rgba(255,255,255,0)")
        ctx2.fillStyle = g
        ctx2.beginPath()
        ctx2.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx2.fill()
        ctx2.restore()
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
        const pickaxeRowStride = CELL_SIZE_PX + GRID_GAP_PX
        for (let r = 0; r < PICKAXE_ROW_COUNT; r++) {
            const y = r * pickaxeRowStride
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

    const formatChestMultiplierText = (m) => {
        const n = Number(m)
        if (!Number.isFinite(n)) return "×?"
        const floored = Math.floor(n * 100) / 100
        if (Math.abs(floored - Math.round(floored)) < 1e-9) return `×${Math.round(floored)}`
        const t = floored.toFixed(2)
        return `×${t.replace(/\.?0+$/, "")}`
    }

    const drawChestRow = (ctx, chests, y) => {
        const nowTs = performance.now()
        const bounceMs = 280
        const multDelayMs = 70
        const multInMs = 260

        for (let c = 0; c < COLS; c++) {
            const x = c * (CELL_SIZE_PX + GRID_GAP_PX)
            const chest = chests?.[c]
            const quality = chest?.quality || "common"
            const multiplier = chest?.multiplier
            const serverOpened = typeof multiplier === "number" && multiplier !== -1

            const chestCfg = CHESTS?.[quality]
            const bounceT0 = chestBounceT0Ref.current.get(c)
            const labelSettled = chestLabelShownRef.current.has(c)
            const visualOpen = serverOpened && (bounceT0 != null || labelSettled)

            let elapsed = 0
            if (bounceT0 != null) elapsed = nowTs - bounceT0

            let bounceOy = 0
            let multScale = 1
            let multAlpha = 0
            let multPopRaw = 0
            if (serverOpened && bounceT0 != null) {
                const tb = Math.min(1, elapsed / bounceMs)
                bounceOy = -Math.sin(Math.PI * tb) * 9
                multPopRaw = Math.max(0, Math.min(1, (elapsed - multDelayMs) / multInMs))
                const sm = multPopRaw * multPopRaw * (3 - 2 * multPopRaw)
                multScale = 0.2 + sm * 0.8
                multAlpha = Math.min(1, sm * 1.15)
            } else if (labelSettled && serverOpened) {
                multScale = 1
                multAlpha = 1
                multPopRaw = 1
            }

            const multPopSm = multPopRaw * multPopRaw * (3 - 2 * multPopRaw)

            ctx.save()
            ctx.translate(0, bounceOy)

            const texClosed = getImage(chestCfg?.TEXTURE)
            const texOpen = getImage(chestCfg?.OPEN_TEXTURE)
            const drawTex = visualOpen && texOpen?.complete ? texOpen : texClosed
            const hasChestTex = !!(drawTex && drawTex.complete)
            ctx.imageSmoothingEnabled = false
            if (!hasChestTex) {
                ctx.fillStyle = chestCfg?.COLOR || "#8b5a2b"
                ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            } else {
                ctx.drawImage(drawTex, x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            }

            if (!visualOpen) {
                ctx.fillStyle = "rgba(0,0,0,0.3)"
                ctx.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
            } else if (multAlpha > 0.02) {
                const cx = x + CELL_SIZE_PX / 2
                const fontPx = Math.max(13, Math.floor(CELL_SIZE_PX * 0.28))
                const yAboveChest = y - fontPx * 0.55 - 6
                const yBurst = y - fontPx * 0.55 - 34
                const labelCy = yBurst + (yAboveChest - yBurst) * multPopSm
                const label = formatChestMultiplierText(multiplier)
                ctx.save()
                ctx.translate(cx, labelCy)
                ctx.scale(multScale, multScale)
                ctx.globalAlpha = multAlpha
                ctx.font = `800 ${fontPx}px system-ui, "Segoe UI", sans-serif`
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.lineWidth = 4
                ctx.strokeStyle = "rgba(0,0,0,0.55)"
                ctx.strokeText(label, 0, 0)
                ctx.fillStyle = "#fff7e0"
                ctx.fillText(label, 0, 0)
                ctx.restore()
            }

            ctx.restore()
        }
    }

    const stopMinerRouletteSound = () => {
        const a = minerRouletteAudioRef.current
        if (!a) return
        try {
            a.pause()
            a.currentTime = 0
        } catch {
        }
    }

    const startMinerRouletteSound = () => {
        if (!MINER_PICKAXE_ROULETE_SOUND) return
        if (suppressSoundRef.current) return
        if (!soundEnabledRef.current) return
        try {
            let a = minerRouletteAudioRef.current
            if (!a) {
                a = new Audio(MINER_PICKAXE_ROULETE_SOUND)
                a.preload = "auto"
                minerRouletteAudioRef.current = a
            }
            a.loop = true
            a.volume = soundVolumeRef.current
            a.currentTime = 0
            void a.play().catch(() => { })
        } catch {
        }
    }

    const stopAllMinerSounds = () => {
        stopMinerRouletteSound()
        audioPoolsRef.current.forEach((pool) => {
            pool.forEach((a) => {
                try {
                    a.pause()
                    a.currentTime = 0
                } catch {
                }
            })
        })
    }

    const ensureAudioPool = (src) => {
        if (!src || typeof src !== "string") return null
        if (!audioPoolsRef.current.has(src)) {
            const pool = [0, 1, 2].map(() => {
                const a = new Audio(src)
                a.preload = "auto"
                a.volume = soundVolumeRef.current
                return a
            })
            audioPoolsRef.current.set(src, pool)
        }
        return audioPoolsRef.current.get(src)
    }

    const playSound = (src) => {
        if (suppressSoundRef.current) return
        if (!soundEnabledRef.current) return
        if (!src) return
        try {
            const pool = ensureAudioPool(src)
            if (!pool?.length) return
            const vol = soundVolumeRef.current
            const audio = pool.find((a) => a.paused || a.ended) || pool[0]
            audio.volume = vol
            audio.currentTime = 0
            void audio.play().catch(() => { })
        } catch {
        }
    }

    const clearAnimation = () => {
        stopAllMinerSounds()
        pickaxeFallRafIdsRef.current.forEach((id) => {
            try {
                cancelAnimationFrame(id)
            } catch {
            }
        })
        pickaxeFallRafIdsRef.current.clear()
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        if (timersRef.current.length) {
            timersRef.current.forEach(t => clearTimeout(t))
            timersRef.current = []
        }
    }

    useEffect(() => {
        soundEnabledRef.current = soundEnabled
    }, [soundEnabled])

    useEffect(() => {
        onRoundCompleteRef.current = onRoundComplete
        onAnimationCompleteRef.current = onAnimationComplete
    }, [onRoundComplete, onAnimationComplete])

    useEffect(() => () => {
        suppressSoundRef.current = true
        stopAllMinerSounds()
        chestBounceT0Ref.current.clear()
        chestLabelShownRef.current.clear()
        if (idleRafRef.current) {
            cancelAnimationFrame(idleRafRef.current)
            idleRafRef.current = null
        }
    }, [])

    useEffect(() => {
        const soundUrls = new Set()
        const push = (u) => { if (u && typeof u === "string") soundUrls.add(u) }
        Object.values(BLOCKS || {}).forEach((b) => {
            push(b?.HIT_SOUND)
            push(b?.BREAK_SOUND)
        })
        Object.values(PICKAXES || {}).forEach((p) => {
            push(p?.HIT_SOUND)
            push(p?.BREAK_SOUND)
        })
        Object.values(CHESTS || {}).forEach((c) => {
            push(c?.OPEN_SOUND)
        })
        soundUrls.forEach((url) => ensureAudioPool(url))
    }, [BLOCKS, PICKAXES, CHESTS])

    useEffect(() => {
        const preload = async () => {
            const glowUrls = Object.values(CHESTS || {}).map((c) => c?.GLOW_TEXTURE).filter(Boolean)
            const openTexUrls = Object.values(CHESTS || {}).map((c) => c?.OPEN_TEXTURE).filter(Boolean)
            const urls = [SLOT_TEXTURE, ...BREAK_TEXTURES, ...glowUrls, ...openTexUrls].filter(Boolean)
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
    }, [SLOT_TEXTURE, BREAK_TEXTURES, CHESTS])

    useEffect(() => {
        if (roundData) return

        const canvas = canvasRef.current
        if (!canvas) return

        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const { worldH } = getWorldMetrics()

        fitCanvasToContainer(canvas, worldW, worldH)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const idleChestGlow = []
        const idleSpawnAcc = Array.from({ length: COLS }, () => 0)
        let idleGlowClock = performance.now()

        const drawIdleChestGlow = (ctx2) => {
            for (const p of idleChestGlow) {
                drawChestGlowParticle(ctx2, p)
            }
        }

        const stepIdleChestGlow = (dt, chests, yChests) => {
            for (let c = 0; c < COLS; c++) {
                const chest = chests[c]
                const q = chest?.quality || "common"
                const cfg = CHESTS?.[q]
                if (!cfg?.GLOW || !cfg?.GLOW_TEXTURE) continue
                const opened = typeof chest?.multiplier === "number" && chest?.multiplier !== -1
                if (opened) continue
                const gp = chestGlowParticleParams(cfg)
                idleSpawnAcc[c] += dt
                while (idleSpawnAcc[c] >= gp.spawnInterval) {
                    idleSpawnAcc[c] -= gp.spawnInterval
                    const cellLeft = c * (CELL_SIZE_PX + GRID_GAP_PX)
                    const pad = Math.max(2, CELL_SIZE_PX * gp.cellPadMult)
                    const span = Math.max(1, CELL_SIZE_PX - pad * 2)
                    const px = cellLeft + pad + Math.random() * span
                    const py = yChests + pad + Math.random() * span
                    const a = Math.random() * Math.PI * 2
                    const speedMul = typeof cfg.GLOW_SPEED === "number" ? cfg.GLOW_SPEED : gp.speedMulDefault
                    const distMul = typeof cfg.GLOW_DISTANCE === "number" ? cfg.GLOW_DISTANCE : gp.distMulDefault
                    const sp = (gp.speedMin + Math.random() * gp.speedRandom) * speedMul * distMul
                    const lifeBase = gp.lifeBase + Math.random() * gp.lifeRandom
                    const maxL = lifeBase * Math.min(gp.lifeDistCap, gp.lifeDistBase + distMul * gp.lifeDistScale)
                    idleChestGlow.push({
                        x: px,
                        y: py,
                        vx: Math.cos(a) * sp,
                        vy: Math.sin(a) * sp,
                        life: maxL,
                        maxLife: maxL,
                        size: gp.sizeMin + Math.random() * gp.sizeRandom,
                        texSrc: cfg.GLOW_TEXTURE,
                        tint: cfg.COLOR || "#ffffff",
                        drag: gp.drag
                    })
                }
            }
            for (let i = idleChestGlow.length - 1; i >= 0; i--) {
                const p = idleChestGlow[i]
                p.life -= dt
                if (p.life <= 0) {
                    idleChestGlow.splice(i, 1)
                    continue
                }
                p.x += p.vx * dt
                p.y += p.vy * dt
                const dg = typeof p.drag === "number" ? p.drag : 0.987
                p.vx *= dg
                p.vy *= dg
            }
        }

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
            drawIdleChestGlow(ctx2)

            if (overlay) overlay(ctx2)
            ctx2.restore()
        }

        const idleTick = (now) => {
            const dt = Math.min((now - idleGlowClock) / 1000, 0.06)
            idleGlowClock = now
            const { yChests } = layoutRef.current
            stepIdleChestGlow(dt, demoChests, yChests)
            drawGrid(demoGrid, demoChests, pickaxesForIdleCanvas, ctx)
            idleRafRef.current = requestAnimationFrame(idleTick)
        }
        idleRafRef.current = requestAnimationFrame(idleTick)

        idleCanvasRedrawRef.current = () => {
            const c = canvasRef.current
            if (!c) return
            const cctx = c.getContext("2d")
            if (!cctx) return
            drawGrid(demoGrid, demoChests, pickaxesForIdleCanvas, cctx)
        }

        return () => {
            if (idleRafRef.current) {
                cancelAnimationFrame(idleRafRef.current)
                idleRafRef.current = null
            }
            idleCanvasRedrawRef.current = null
        }
    }, [roundData, pickaxesForIdleCanvas, ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, CHESTS, demoGrid, demoChests])

    useEffect(() => {
        if (!roundData) return

        suppressSoundRef.current = false

        const fallSlotOverlays = new Map()

        const canvas = canvasRef.current
        if (!canvas) return
        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const { worldH } = getWorldMetrics()
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        fitCanvasToContainer(canvas, worldW, worldH)

        clearAnimation()
        chestBounceT0Ref.current.clear()
        chestLabelShownRef.current.clear()

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
        const introHidePickaxesRef = { current: true }
        const emptySlotsDuringIntro = Array.from({ length: totalPickaxeSlots }, () => null)

        const currentGrid = baseGrid.map(row => row.slice())
        const currentChests = baseChests.map(c => ({ ...c }))

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

        const shakesRef = { current: new Map() }
        const particlesRef = { current: [] }
        let lastParticleTs = performance.now()

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

        const roundChestGlow = []
        const roundSpawnAcc = Array.from({ length: COLS }, () => 0)
        let roundGlowClock = performance.now()

        const drawRoundChestGlow = (ctx2) => {
            for (const p of roundChestGlow) {
                drawChestGlowParticle(ctx2, p)
            }
        }

        const stepRoundChestGlow = (dt, chests, yChests) => {
            for (let c = 0; c < COLS; c++) {
                const chest = chests?.[c]
                const q = chest?.quality || "common"
                const cfg = CHESTS?.[q]
                if (!cfg?.GLOW || !cfg?.GLOW_TEXTURE) continue
                const opened = typeof chest?.multiplier === "number" && chest?.multiplier !== -1
                if (opened) continue
                const gp = chestGlowParticleParams(cfg)
                roundSpawnAcc[c] += dt
                while (roundSpawnAcc[c] >= gp.spawnInterval) {
                    roundSpawnAcc[c] -= gp.spawnInterval
                    const cellLeft = c * (CELL_SIZE_PX + GRID_GAP_PX)
                    const pad = Math.max(2, CELL_SIZE_PX * gp.cellPadMult)
                    const span = Math.max(1, CELL_SIZE_PX - pad * 2)
                    const px = cellLeft + pad + Math.random() * span
                    const py = yChests + pad + Math.random() * span
                    const a = Math.random() * Math.PI * 2
                    const speedMul = typeof cfg.GLOW_SPEED === "number" ? cfg.GLOW_SPEED : gp.speedMulDefault
                    const distMul = typeof cfg.GLOW_DISTANCE === "number" ? cfg.GLOW_DISTANCE : gp.distMulDefault
                    const sp = (gp.speedMin + Math.random() * gp.speedRandom) * speedMul * distMul
                    const lifeBase = gp.lifeBase + Math.random() * gp.lifeRandom
                    const maxL = lifeBase * Math.min(gp.lifeDistCap, gp.lifeDistBase + distMul * gp.lifeDistScale)
                    roundChestGlow.push({
                        x: px,
                        y: py,
                        vx: Math.cos(a) * sp,
                        vy: Math.sin(a) * sp,
                        life: maxL,
                        maxLife: maxL,
                        size: gp.sizeMin + Math.random() * gp.sizeRandom,
                        texSrc: cfg.GLOW_TEXTURE,
                        tint: cfg.COLOR || "#ffffff",
                        drag: gp.drag
                    })
                }
            }
            for (let i = roundChestGlow.length - 1; i >= 0; i--) {
                const p = roundChestGlow[i]
                p.life -= dt
                if (p.life <= 0) {
                    roundChestGlow.splice(i, 1)
                    continue
                }
                p.x += p.vx * dt
                p.y += p.vy * dt
                const dg = typeof p.drag === "number" ? p.drag : 0.987
                p.vx *= dg
                p.vy *= dg
            }
        }

        const drawGrid = (grid, chests, overlay) => {
            const { cssW, cssH, scale, offsetX, yBlocks, yChests } = layoutRef.current
            const nowGlowStep = performance.now()
            const gdt = Math.min((nowGlowStep - roundGlowClock) / 1000, 0.06)
            roundGlowClock = nowGlowStep
            stepRoundChestGlow(gdt, chests || demoChests, yChests)

            ctx.clearRect(0, 0, cssW, cssH)
            ctx.save()
            ctx.translate(offsetX, 0)
            ctx.scale(scale, scale)

            drawPickaxeRow(ctx, introHidePickaxesRef.current ? emptySlotsDuringIntro : pickaxesToRenderRef.current)

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
            drawRoundChestGlow(ctx)

            if (overlay) overlay(ctx)
            ctx.restore()
        }

        const winFromServer = Number(roundData?.winAmount ?? roundData?.win ?? roundData?.payout ?? 0) || 0

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

        const drawFallOverlaysOnCtx = (g) => {
            fallSlotOverlays.forEach((ov) => {
                const x = ov.col * (CELL_SIZE_PX + GRID_GAP_PX)
                drawPickaxeIcon(g, ov.pickaxeKey, x, ov.yWorld, {
                    rotation: ov.angle || 0,
                    scale: 1
                })
            })
        }

        const drawWithOverlay = () => {
            drawGrid(currentGrid, currentChests, (g) => {
                drawFallOverlaysOnCtx(g)
                updateAndDrawParticles(g)
            })
        }

        const waitWithOverlayTicks = (pauseMs) => new Promise((resolve) => {
            const ms = Math.max(0, Number(pauseMs) || 0)
            if (ms <= 0) {
                resolve()
                return
            }
            const t0 = performance.now()
            let rafId = 0
            const tick = (now) => {
                drawWithOverlay()
                if (now - t0 >= ms) {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    resolve()
                    return
                }
                pickaxeFallRafIdsRef.current.delete(rafId)
                rafId = requestAnimationFrame(tick)
                pickaxeFallRafIdsRef.current.add(rafId)
            }
            rafId = requestAnimationFrame(tick)
            pickaxeFallRafIdsRef.current.add(rafId)
        })

        const openChestStep = (col) => new Promise((resolve) => {
            const chest = currentChests?.[col]
            const quality = chest?.quality || "common"
            const multiplier = chest?.multiplier
            const isOpened = typeof multiplier === "number" && multiplier !== -1
            if (!isOpened) {
                resolve()
                return
            }
            const raw = Number(multiplier)
            chest.multiplier = Math.floor(raw * 100) / 100

            const t0 = performance.now()
            chestBounceT0Ref.current.set(col, t0)
            playSound(CHESTS?.[quality]?.OPEN_SOUND)
            const total = 440
            let rafId = 0
            const tick = (now) => {
                drawWithOverlay()
                if (now - t0 < total) {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    rafId = requestAnimationFrame(tick)
                    pickaxeFallRafIdsRef.current.add(rafId)
                } else {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    chestBounceT0Ref.current.delete(col)
                    chestLabelShownRef.current.add(col)
                    drawWithOverlay()
                    resolve()
                }
            }
            rafId = requestAnimationFrame(tick)
            pickaxeFallRafIdsRef.current.add(rafId)
        })

        let chestOpenChain = Promise.resolve()
        const queueOpenChest = (col) => {
            const p = chestOpenChain.then(() => openChestStep(col))
            chestOpenChain = p.catch(() => { })
            return p
        }

        const animateParticlesFor = (durationMs = 180) => new Promise((resolve) => {
            const start = performance.now()
            let rafId = 0
            const tick = (now) => {
                drawWithOverlay()
                if (now - start >= durationMs || particlesRef.current.length === 0) {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    resolve()
                    return
                }
                pickaxeFallRafIdsRef.current.delete(rafId)
                rafId = requestAnimationFrame(tick)
                pickaxeFallRafIdsRef.current.add(rafId)
            }
            rafId = requestAnimationFrame(tick)
            pickaxeFallRafIdsRef.current.add(rafId)
        })

        const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)

        const animateFall = (slotIndex, col, fromY, toY, pickaxeKey, durationMs = PICKAXE_FALL_DURATION_MS, spins = PICKAXE_FALL_SPINS, impactSound = null) => new Promise((resolve) => {
            const dy = toY - fromY
            const ady = Math.abs(dy)
            const snapEps = 1.5
            if (ady < snapEps) {
                if (impactSound) playSound(impactSound)
                const endAngle = Math.PI * 2 * spins
                fallSlotOverlays.set(slotIndex, { col, yWorld: toY, pickaxeKey, angle: endAngle })
                drawWithOverlay()
                resolve(endAngle)
                return
            }
            const minFallForFullSpin = Math.max(20, CELL_SIZE_PX * 0.5)
            const spinEff = spins * Math.min(1, ady / minFallForFullSpin)
            const endAngle = Math.PI * 2 * spinEff
            const start = performance.now()
            let rafId = 0
            const tick = (now) => {
                const t = Math.min((now - start) / durationMs, 1)
                const e = easeOutQuad(t)
                const y = fromY + dy * e
                const angle = e * endAngle
                fallSlotOverlays.set(slotIndex, { col, yWorld: y, pickaxeKey, angle })
                drawWithOverlay()
                if (t < 1) {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    rafId = requestAnimationFrame(tick)
                    pickaxeFallRafIdsRef.current.add(rafId)
                } else {
                    if (impactSound) playSound(impactSound)
                    fallSlotOverlays.set(slotIndex, { col, yWorld: toY, pickaxeKey, angle: endAngle })
                    drawWithOverlay()
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    resolve(endAngle)
                }
            }
            rafId = requestAnimationFrame(tick)
            pickaxeFallRafIdsRef.current.add(rafId)
        })

        const animatePickaxeBounce = (slotIndex, col, yBase, pickaxeKey, angleBase = 0, impactSound = null, opts = null) => new Promise((resolve) => {
            const duration = opts?.durationMs ?? PICKAXE_BOUNCE_DURATION_MS
            const baseJump = Math.max(34, CELL_SIZE_PX * 0.72)
            const heightMult = opts?.jumpHeightMult != null
                ? opts.jumpHeightMult
                : PICKAXE_BOUNCE_HEIGHT_MULT
            const jump = baseJump * heightMult
            const turnScale = opts?.recoil
                ? Math.min(1, Math.max(0, Number(PICKAXE_RECOIL_SPIN_TURNS) || 0))
                : Math.min(1, jump / (baseJump * 0.72))
            const start = performance.now()
            let rafId = 0
            const tick = (now) => {
                const t = Math.min((now - start) / duration, 1)
                const lift = Math.sin(t * Math.PI)
                const rot = easeOutQuad(t)
                const y = yBase - lift * jump
                const angle = angleBase + rot * Math.PI * 2 * turnScale
                fallSlotOverlays.set(slotIndex, { col, yWorld: y, pickaxeKey, angle })
                drawWithOverlay()
                if (t < 1) {
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    rafId = requestAnimationFrame(tick)
                    pickaxeFallRafIdsRef.current.add(rafId)
                } else {
                    if (impactSound) playSound(impactSound)
                    const landed = angleBase + Math.PI * 2 * turnScale
                    fallSlotOverlays.set(slotIndex, { col, yWorld: yBase, pickaxeKey, angle: landed })
                    drawWithOverlay()
                    pickaxeFallRafIdsRef.current.delete(rafId)
                    resolve(landed)
                }
            }
            rafId = requestAnimationFrame(tick)
            pickaxeFallRafIdsRef.current.add(rafId)
        })

        const hitFlash = (row, col, broke) => {
            drawGrid(currentGrid, currentChests, (g) => {
                drawFallOverlaysOnCtx(g)
                const { yBlocks } = layoutRef.current
                const x = col * (CELL_SIZE_PX + GRID_GAP_PX)
                const y = yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX)
                g.fillStyle = "rgba(255,255,255,0.18)"
                g.fillRect(x, y, CELL_SIZE_PX, CELL_SIZE_PX)
                updateAndDrawParticles(g)
            })

            const shakeDuration = 150
            const shakeAmp = broke ? 2.5 : 4
            shakesRef.current.set(`${row}:${col}`, { start: performance.now(), duration: shakeDuration, amp: shakeAmp })
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

                const blockCfg = BLOCKS?.[blockKey]
                const targetY = layoutRef.current.yBlocks + row * (CELL_SIZE_PX + GRID_GAP_PX) - CELL_SIZE_PX * 0.55
                spinAngle = await animateFall(slotIndex, col, currentY, targetY, pickaxeKey, PICKAXE_FALL_DURATION_MS, PICKAXE_FALL_SPINS, blockCfg?.HIT_SOUND)
                currentY = targetY

                const baseDamage = Math.max(1, Math.ceil((blockCfg?.HEALTH || 1) / 3))

                while (hp > 0 && blockHp[row][col] > 0) {
                    const willBreakBlock = blockHp[row][col] - baseDamage <= 0
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
                        if (!pickaxeDestroyed) {
                            spinAngle = await animatePickaxeBounce(slotIndex, col, currentY, pickaxeKey, spinAngle, null, {
                                durationMs: PICKAXE_RECOIL_AFTER_BREAK_MS,
                                jumpHeightMult: PICKAXE_RECOIL_JUMP_MULT,
                                recoil: true
                            })
                        }
                    }

                    if (pickaxeDestroyed) {
                        fallSlotOverlays.delete(slotIndex)
                        playSound(PICKAXES?.[pickaxeKey]?.BREAK_SOUND)
                        spawnPickaxeBreakParticles(col, currentY, PICKAXES?.[pickaxeKey]?.COLOR)
                        drawGrid(currentGrid, currentChests, (g) => {
                            drawFallOverlaysOnCtx(g)
                            updateAndDrawParticles(g)
                        })
                        await animateParticlesFor(110)
                    }

                    if (blockDestroyed || pickaxeDestroyed) {
                        break
                    }

                    spinAngle = await animatePickaxeBounce(slotIndex, col, currentY, pickaxeKey, spinAngle, blockCfg?.HIT_SOUND)
                    await waitWithOverlayTicks(PICKAXE_BETWEEN_HIT_DELAY_MS)
                }

                if (hp <= 0) break

                await waitWithOverlayTicks(45)
            }

            fallSlotOverlays.delete(slotIndex)
            drawWithOverlay()

            const columnCleared = Array.from({ length: ROWS }, (_, r) => !currentGrid?.[r]?.[col]).every(Boolean)
            const chestMult = currentChests?.[col]?.multiplier
            if (!chestOpened[col] && columnCleared && typeof chestMult === "number" && chestMult !== -1) {
                chestOpened[col] = true
                await queueOpenChest(col)
            }
        }

        const runAll = async () => {
            const pauseMs = Math.max(0, Number(PICKAXE_ROW_PAUSE_MS) || 0)
            for (let r = 0; r < PICKAXE_ROW_COUNT; r++) {
                const base = r * COLS
                await Promise.all(
                    Array.from({ length: COLS }, (_, c) => runPickaxeFromSlot(base + c))
                )
                if (r < PICKAXE_ROW_COUNT - 1 && pauseMs > 0) {
                    await waitWithOverlayTicks(pauseMs)
                }
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
                if (!soundEnabledRef.current) stopMinerRouletteSound()
                rafRef.current = requestAnimationFrame(animateSpin)
                return
            }

            const bouncesPending = bounceState.some((b) => b.start > 0 && now < b.start + b.duration)
            if (bouncesPending) {
                if (!soundEnabledRef.current) stopMinerRouletteSound()
                rafRef.current = requestAnimationFrame(animateSpin)
                return
            }

            stopMinerRouletteSound()
            drawGrid(currentGrid, currentChests)

            timersRef.current.push(setTimeout(() => {
                finishRoundVisuals()
            }, afterSpinDelayMs))
        }

        const startSpinWithIntro = async () => {
            introHidePickaxesRef.current = true
            await runInitialBlocksReveal()
            introHidePickaxesRef.current = false
            startMinerRouletteSound()
            rafRef.current = requestAnimationFrame(animateSpin)
        }

        roundCanvasRedrawRef.current = drawWithOverlay

        startSpinWithIntro()

        return () => {
            suppressSoundRef.current = true
            roundCanvasRedrawRef.current = null
            chestBounceT0Ref.current.clear()
            chestLabelShownRef.current.clear()
            clearAnimation()
        }
    }, [roundData, ROWS, COLS, CELL_SIZE_PX, GRID_GAP_PX, BLOCKS, PICKAXES, CHESTS, BREAK_TEXTURES, SLOT_TEXTURE, demoGrid, demoChests])

    useEffect(() => {
        const canvas = canvasRef.current
        const el = containerRef.current
        if (!canvas || !el) return

        const worldW = COLS * CELL_SIZE_PX + (COLS - 1) * GRID_GAP_PX
        const { worldH } = getWorldMetrics()

        const apply = () => {
            fitCanvasToContainer(canvas, worldW, worldH)
            requestAnimationFrame(() => {
                roundCanvasRedrawRef.current?.()
                idleCanvasRedrawRef.current?.()
            })
        }

        const ro = new ResizeObserver(() => apply())
        ro.observe(el)
        apply()

        return () => {
            ro.disconnect()
        }
    }, [COLS, ROWS, CELL_SIZE_PX, GRID_GAP_PX, PICKAXE_ROW_COUNT])

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

export default memo(MinerField)