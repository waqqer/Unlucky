import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useRef } from "react"
import { toast } from "react-toastify"
import { Application, Assets, Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js"
import { gsap } from "gsap"
import styles from "./Miner.module.css"
import type { Chest, Field, MinerResult } from "@/Api/Game/Types"
import GameApi from "@/Api/Game"
import Config from "@/Shared/Configs/Game/Miner"
import type { GameProps, GameRef } from "@/Shared/Types/GameTypes"
import { AccountContext } from "@/Context/AccountContext"
import { AuthContext } from "@/Context/AuthContext"

type CellSprite = Sprite & {
    baseX: number
    baseY: number
}

type PickaxeSlot = {
    slot: Sprite
    sprite: Sprite | null
}

type BlockCell = {
    key: string
    hp: number
    maxHp: number
    sprite: CellSprite
    border: Graphics
    crack: Sprite
}

type Runtime = {
    app: Application
    root: Container
    slotsLayer: Container
    blocksLayer: Container
    chestsLayer: Container
    pickaxesLayer: Container
    effectsLayer: Container
    labelLayer: Container
    pickaxeSlots: PickaxeSlot[]
    blocks: (BlockCell | null)[][]
    chests: {
        data: Chest
        sprite: CellSprite
        label: Text | null
        opened: boolean
    }[]
    spinTweens: gsap.core.Tween[]
    glowTweens: gsap.core.Tween[]
    audioPools: Map<string, HTMLAudioElement[]>
    resizeObserver: ResizeObserver | null
    isAnimating: boolean
}

const CHEST_ROWS = 1
const PICKAXES_SECTION_GAP = 40
const SECTION_GAP = 18
const WORLD_WIDTH = Config.COLS * Config.CELL_SIZE_PX + (Config.COLS - 1) * Config.GRID_GAP_PX
const PICKAXES_HEIGHT = Config.PICKAXES_ROWS * Config.CELL_SIZE_PX + (Config.PICKAXES_ROWS - 1) * Config.PICKAXES_GRID_GAP_Y_PX
const BLOCKS_HEIGHT = Config.ROWS * Config.CELL_SIZE_PX + (Config.ROWS - 1) * Config.GRID_GAP_PX
const CHESTS_HEIGHT = CHEST_ROWS * Config.CELL_SIZE_PX
const BLOCKS_Y = PICKAXES_HEIGHT + PICKAXES_SECTION_GAP
const CHESTS_Y = BLOCKS_Y + BLOCKS_HEIGHT + SECTION_GAP
const WORLD_HEIGHT = CHESTS_Y + CHESTS_HEIGHT
const PADDED_WORLD_WIDTH = WORLD_WIDTH + Config.STAGE_PADDING_PX * 2
const PADDED_WORLD_HEIGHT = WORLD_HEIGHT + Config.STAGE_PADDING_PX * 2
const BLOCK_BORDER_ALPHA = 0.25
const BLOCK_REVEAL_STAGGER_SEC = 0.028
const BLOCK_REVEAL_DURATION_SEC = 0.24
const BLOCK_REVEAL_BOUNCE_PX = 9
const PICKAXE_SLOT_SCALE = 0.71
const PICKAXE_HIT_CENTER_OFFSET_Y = Config.CELL_SIZE_PX * PICKAXE_SLOT_SCALE * 0.2
const SPIN_SOUND_MIN_INTERVAL_MS = 80
const SPIN_SOUND_PLAY_MS = 24

const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

const tweenTo = (target: gsap.TweenTarget, vars: gsap.TweenVars) => new Promise<void>(resolve => {
    gsap.to(target, {
        ...vars,
        onComplete: () => {
            vars.onComplete?.()
            resolve()
        }
    })
})

const randomRange = (min: number, max: number) => min + Math.random() * Math.max(0, max - min)

const getCellPosition = (row: number, col: number, yOffset = 0, rowGap = Config.GRID_GAP_PX) => ({
    x: col * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX),
    y: yOffset + row * (Config.CELL_SIZE_PX + rowGap)
})

const formatMultiplier = (value: number) => {
    const rounded = Math.floor(value * 100) / 100
    return `x${rounded.toFixed(2).replace(/\.?0+$/, "")}`
}

const formatWinAmount = (bet: number, multiplier: number) => {
    return Math.max(0, Math.floor(bet * multiplier * 100) / 100)
}

const pixelAsset = (src: string) => ({
    src,
    data: {
        scaleMode: "nearest" as const
    }
})

const Miner = forwardRef<GameRef, GameProps>((props, ref) => {
    const { data } = props
    const hostRef = useRef<HTMLDivElement>(null)
    const runtimeRef = useRef<Runtime | null>(null)
    const fieldRef = useRef<Field | null>(null)
    const playIdRef = useRef(0)
    const audioStopTimersRef = useRef(new Map<HTMLAudioElement, number>())

    const { account } = useContext(AuthContext)
    const { flushBalanceUpdate, incrementBalance, queueBalanceUpdate } = useContext(AccountContext)

    const makePixelTexture = useCallback((texture: Texture) => {
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
    }, [])

    const getTexture = useCallback((src: string) => {
        return makePixelTexture(Assets.get<Texture>(src) || Texture.from(src))
    }, [makePixelTexture])

    const stopAudio = useCallback((audio: HTMLAudioElement) => {
        const existingTimer = audioStopTimersRef.current.get(audio)
        if (existingTimer) {
            window.clearTimeout(existingTimer)
            audioStopTimersRef.current.delete(audio)
        }

        audio.volume = 0
        audio.pause()
        audio.currentTime = 0
    }, [])

    const playSound = useCallback((src?: string, maxDurationMs?: number) => {
        const runtime = runtimeRef.current
        if (!runtime || !src) return

        if (!runtime.audioPools.has(src)) {
            runtime.audioPools.set(src, [0, 1, 2].map(() => {
                const audio = new Audio(src)
                audio.preload = "auto"
                audio.volume = Config.SOUND_VOLUME
                return audio
            }))
        }

        const pool = runtime.audioPools.get(src)
        const audio = pool?.find(item => item.paused || item.ended) || pool?.[0]
        if (!audio) return

        stopAudio(audio)
        audio.currentTime = 0
        audio.volume = Config.SOUND_VOLUME
        void audio.play().catch(() => undefined)

        if (maxDurationMs) {
            const timer = window.setTimeout(() => {
                stopAudio(audio)
            }, maxDurationMs)
            audioStopTimersRef.current.set(audio, timer)
        }
    }, [stopAudio])

    const stopSound = useCallback((src?: string) => {
        const runtime = runtimeRef.current
        if (!runtime || !src) return

        runtime.audioPools.get(src)?.forEach(stopAudio)
    }, [stopAudio])

    const createSprite = useCallback((src: string, x: number, y: number, layer: Container, alpha = 1): CellSprite => {
        const sprite = new Sprite(getTexture(src)) as CellSprite
        sprite.x = x
        sprite.y = y
        sprite.baseX = x
        sprite.baseY = y
        sprite.width = Config.CELL_SIZE_PX
        sprite.height = Config.CELL_SIZE_PX
        sprite.alpha = alpha
        layer.addChild(sprite)
        return sprite
    }, [getTexture])

    const createBlockBorder = useCallback((x: number, y: number, layer: Container) => {
        const border = new Graphics()
            .rect(0.5, 0.5, Config.CELL_SIZE_PX - 1, Config.CELL_SIZE_PX - 1)
            .stroke({ color: 0xffffff, alpha: BLOCK_BORDER_ALPHA, width: 3 })

        border.x = x
        border.y = y
        layer.addChild(border)
        return border
    }, [])

    const setupPickaxeSprite = useCallback((sprite: Sprite, x: number, y: number, scale = PICKAXE_SLOT_SCALE) => {
        sprite.anchor.set(0.5)
        sprite.x = x + Config.CELL_SIZE_PX / 2
        sprite.y = y + Config.CELL_SIZE_PX / 2
        sprite.width = Config.CELL_SIZE_PX * scale
        sprite.height = Config.CELL_SIZE_PX * scale
        sprite.rotation = 0
        sprite.alpha = 1
        sprite.visible = true
        return sprite
    }, [])

    const resizeScene = useCallback(() => {
        const host = hostRef.current
        const runtime = runtimeRef.current
        if (!host || !runtime) return

        const width = Math.max(1, host.clientWidth)
        const height = Math.max(1, host.clientHeight)
        const scale = Math.min(width / PADDED_WORLD_WIDTH, height / PADDED_WORLD_HEIGHT)

        runtime.app.renderer.resize(width, height)
        runtime.app.canvas.style.width = `${width}px`
        runtime.app.canvas.style.height = `${height}px`
        runtime.root.scale.set(scale)
        runtime.root.x = (width - PADDED_WORLD_WIDTH * scale) / 2 + Config.STAGE_PADDING_PX * scale
        runtime.root.y = (height - PADDED_WORLD_HEIGHT * scale) / 2 + Config.STAGE_PADDING_PX * scale
    }, [])

    const cleanupScene = useCallback(() => {
        const runtime = runtimeRef.current
        if (!runtime) return

        runtime.spinTweens.forEach(tween => tween.kill())
        runtime.glowTweens.forEach(tween => tween.kill())
        gsap.killTweensOf(runtime.root.children)
        audioStopTimersRef.current.forEach(timer => window.clearTimeout(timer))
        audioStopTimersRef.current.clear()
        runtime.audioPools.forEach(pool => pool.forEach(stopAudio))
    }, [stopAudio])

    const spawnParticles = useCallback((
        x: number,
        y: number,
        color: string,
        count = 14,
        glowTexture?: string,
        glowSizeConfig?: Pick<typeof Config.CHEST_GLOW_DEFAULTS, "sizeMinPx" | "sizeRandomPx">
    ) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const particleSizeConfig = glowSizeConfig || Config.CHEST_GLOW_DEFAULTS

        for (let index = 0; index < count; index++) {
            const size = 4 + Math.random() * 4
            const particle = glowTexture
                ? new Sprite(getTexture(glowTexture))
                : new Graphics().rect(-size / 2, -size / 2, size, size).fill(color)

            particle.x = x + Config.CELL_SIZE_PX / 2
            particle.y = y + Config.CELL_SIZE_PX / 2
            particle.alpha = randomRange(Config.PARTICLE_ALPHA_MIN, Config.PARTICLE_ALPHA_MAX)
            particle.rotation = Math.random() * Math.PI
            particle.scale.set(glowTexture
                ? (particleSizeConfig.sizeMinPx + Math.random() * particleSizeConfig.sizeRandomPx) / Config.CELL_SIZE_PX
                : 1)
            if (particle instanceof Sprite) {
                particle.anchor.set(0.5)
                particle.tint = color
            }

            runtime.effectsLayer.addChild(particle)

            const angle = Math.random() * Math.PI * 2
            const distance = 18 + Math.random() * 38
            gsap.to(particle, {
                x: particle.x + Math.cos(angle) * distance,
                y: particle.y + Math.sin(angle) * distance,
                alpha: 0,
                duration: 0.45 + Math.random() * 0.25,
                ease: "power2.out",
                onComplete: () => particle.destroy()
            })
        }
    }, [getTexture])

    const updateCrackOverlay = useCallback((block: BlockCell) => {
        const progress = 1 - block.hp / block.maxHp
        const index = Math.min(Config.BREAK_TEXTURE.length - 1, Math.max(0, Math.floor(progress * Config.BREAK_TEXTURE.length)))
        block.crack.texture = getTexture(Config.BREAK_TEXTURE[index])
        block.crack.alpha = progress <= 0 ? 0 : Math.min(0.92, progress + 0.12)
    }, [getTexture])

    const shakeBlock = useCallback(async (block: BlockCell, broke: boolean) => {
        const amplitude = broke ? 2 : 4
        const offset = { x: 0, y: 0 }
        const setBlockOffset = () => {
            block.sprite.x = block.sprite.baseX + offset.x
            block.sprite.y = block.sprite.baseY + offset.y
            block.border.x = block.sprite.baseX + offset.x
            block.border.y = block.sprite.baseY + offset.y
            block.crack.x = block.sprite.baseX + offset.x
            block.crack.y = block.sprite.baseY + offset.y
        }

        await tweenTo(offset, {
            x: amplitude,
            y: -1,
            yoyo: true,
            repeat: 3,
            duration: 0.035,
            ease: "sine.inOut",
            onUpdate: setBlockOffset,
            onComplete: () => {
                block.sprite.x = block.sprite.baseX
                block.sprite.y = block.sprite.baseY
                block.border.x = block.sprite.baseX
                block.border.y = block.sprite.baseY
                block.crack.x = block.sprite.baseX
                block.crack.y = block.sprite.baseY
            }
        })
    }, [])

    const addChestGlow = useCallback((col: number, chest: Chest) => {
        const runtime = runtimeRef.current
        const chestConfig = Config.CHESTS[chest.quality]
        if (!runtime || !chestConfig?.glow) return

        const glow = { tick: 0 }
        const glowConfig = { ...Config.CHEST_GLOW_DEFAULTS, ...chestConfig.glow_config }
        const { x, y } = getCellPosition(0, col, CHESTS_Y)

        const tween = gsap.to(glow, {
            tick: 1,
            repeat: -1,
            duration: glowConfig.spawnIntervalSec,
            ease: "none",
            onRepeat: () => {
                const pad = Config.CELL_SIZE_PX * glowConfig.cellPaddingMult
                const px = x + pad + Math.random() * (Config.CELL_SIZE_PX - pad * 2)
                const py = y + pad + Math.random() * (Config.CELL_SIZE_PX - pad * 2)
                const particle = new Sprite(getTexture(chestConfig.glow_texture))
                particle.anchor.set(0.5)
                particle.x = px
                particle.y = py
                particle.tint = chestConfig.color
                particle.alpha = randomRange(glowConfig.alphaMin, glowConfig.alphaMax)
                particle.scale.set((glowConfig.sizeMinPx + Math.random() * glowConfig.sizeRandomPx) / Config.CELL_SIZE_PX)
                runtime.effectsLayer.addChild(particle)

                const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI
                const speed = (glowConfig.speedMin + Math.random() * glowConfig.speedRandom) * glowConfig.speedMultiplier
                const distance = speed * glowConfig.distanceMultiplier
                gsap.to(particle, {
                    x: px + Math.cos(angle) * distance,
                    y: py + Math.sin(angle) * distance,
                    alpha: 0,
                    duration: glowConfig.lifeBaseSec + Math.random() * glowConfig.lifeRandomSec,
                    ease: "power2.out",
                    onComplete: () => particle.destroy()
                })
            }
        })

        runtime.glowTweens.push(tween)
    }, [getTexture])

    const drawIdleScene = useCallback((field?: Field) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        cleanupScene()
        runtime.pickaxeSlots = []
        runtime.blocks = []
        runtime.chests = []
        runtime.slotsLayer.removeChildren()
        runtime.blocksLayer.removeChildren()
        runtime.chestsLayer.removeChildren()
        runtime.pickaxesLayer.removeChildren()
        runtime.effectsLayer.removeChildren()
        runtime.labelLayer.removeChildren()

        const pickaxeKeys = Object.keys(Config.PICKAXES)
        const blockKeys = Object.keys(Config.BLOCKS)

        for (let row = 0; row < Config.PICKAXES_ROWS; row++) {
            for (let col = 0; col < Config.COLS; col++) {
                const { x, y } = getCellPosition(row, col, 0, Config.PICKAXES_GRID_GAP_Y_PX)
                const slot = createSprite(Config.SLOT_TEXTURE, x, y, runtime.slotsLayer)
                const key = field?.pickaxes[row]?.[col] || pickaxeKeys[(row * Config.COLS + col) % pickaxeKeys.length]
                const sprite = key ? createSprite(Config.PICKAXES[key]?.texture, x, y, runtime.pickaxesLayer) : null
                if (sprite) {
                    setupPickaxeSprite(sprite, x, y)
                }
                runtime.pickaxeSlots.push({ slot, sprite })
            }
        }

        for (let row = 0; row < Config.ROWS; row++) {
            runtime.blocks[row] = []
            for (let col = 0; col < Config.COLS; col++) {
                const key = field?.blocks[row]?.[col] || blockKeys[(row * Config.COLS + col) % blockKeys.length]
                if (!key) {
                    runtime.blocks[row][col] = null
                    continue
                }
                const cfg = Config.BLOCKS[key]
                const { x, y } = getCellPosition(row, col, BLOCKS_Y)
                const sprite = createSprite(cfg.texture, x, y, runtime.blocksLayer)
                const border = createBlockBorder(x, y, runtime.blocksLayer)
                const crack = createSprite(Config.BREAK_TEXTURE[0], x, y, runtime.blocksLayer, 0)
                const revealOrder = (Config.ROWS - 1 - row) * Config.COLS + col
                const revealState = { t: 0 }
                const applyReveal = () => {
                    const smoothed = revealState.t * revealState.t * (3 - 2 * revealState.t)
                    const offsetY = -Math.sin(Math.PI * revealState.t) * BLOCK_REVEAL_BOUNCE_PX
                    sprite.alpha = smoothed
                    border.alpha = smoothed
                    crack.alpha = 0
                    sprite.y = y + offsetY
                    border.y = y + offsetY
                    crack.y = y + offsetY
                }

                applyReveal()
                gsap.to(revealState, {
                    t: 1,
                    delay: revealOrder * BLOCK_REVEAL_STAGGER_SEC,
                    duration: BLOCK_REVEAL_DURATION_SEC,
                    ease: "none",
                    onUpdate: applyReveal,
                    onComplete: () => {
                        sprite.alpha = 1
                        border.alpha = 1
                        crack.alpha = 0
                        sprite.y = y
                        border.y = y
                        crack.y = y
                    }
                })
                runtime.blocks[row][col] = { key, hp: cfg.health, maxHp: cfg.health, sprite, border, crack }
            }
        }

        for (let col = 0; col < Config.COLS; col++) {
            const chest = field?.chests[col] || { quality: ["common", "uncommon", "rare", "epic"][col % 4], multiplier: -1 }
            const cfg = Config.CHESTS[chest.quality] || Config.CHESTS.common
            const { x, y } = getCellPosition(0, col, CHESTS_Y)
            const sprite = createSprite(cfg.texture, x, y, runtime.chestsLayer)
            runtime.chests.push({ data: chest, sprite, label: null, opened: false })
            addChestGlow(col, chest)
        }

        resizeScene()
    }, [addChestGlow, cleanupScene, createBlockBorder, createSprite, resizeScene, setupPickaxeSprite])

    const openChest = useCallback(async (col: number) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const chest = runtime.chests[col]
        if (!chest || chest.opened || chest.data.multiplier === -1) return

        const cfg = Config.CHESTS[chest.data.quality] || Config.CHESTS.common
        chest.opened = true
        chest.sprite.texture = getTexture(cfg.opened_texture)
        chest.sprite.width = Config.CELL_SIZE_PX
        chest.sprite.height = Config.CELL_SIZE_PX
        chest.sprite.anchor.set(0.5)
        chest.sprite.x = chest.sprite.baseX + Config.CELL_SIZE_PX / 2
        chest.sprite.y = chest.sprite.baseY + Config.CELL_SIZE_PX / 2
        playSound(cfg.sound.opening)

        const label = new Text({
            text: formatMultiplier(chest.data.multiplier),
            style: new TextStyle({
                fill: "#fff7d6",
                fontFamily: "Arial",
                fontSize: 21,
                fontWeight: "800",
                stroke: { color: "#2a1609", width: 4 }
            })
        })
        label.anchor.set(0.5)
        label.x = chest.sprite.baseX + Config.CELL_SIZE_PX / 2
        label.y = chest.sprite.baseY - 24
        label.alpha = 0
        label.scale.set(0.2)
        runtime.labelLayer.addChild(label)
        chest.label = label

        spawnParticles(
            chest.sprite.baseX,
            chest.sprite.baseY,
            cfg.color,
            cfg.glow ? 20 : 10,
            cfg.glow ? cfg.glow_texture : undefined,
            { ...Config.CHEST_GLOW_DEFAULTS, ...cfg.glow_config }
        )

        const chestRestY = chest.sprite.baseY + Config.CELL_SIZE_PX / 2
        const scaleX = chest.sprite.scale.x
        const scaleY = chest.sprite.scale.y
        await Promise.all([
            tweenTo(chest.sprite, {
                y: chestRestY - 9,
                yoyo: true,
                repeat: 1,
                duration: Config.CHEST_OPEN_DURATION_MS / 2000,
                ease: "sine.out",
                onComplete: () => {
                    chest.sprite.y = chestRestY
                }
            }),
            tweenTo(chest.sprite.scale, {
                x: scaleX * 1.1,
                y: scaleY * 1.1,
                yoyo: true,
                repeat: 1,
                duration: Config.CHEST_OPEN_DURATION_MS / 2000,
                ease: "sine.out",
                onComplete: () => {
                    chest.sprite.scale.set(scaleX, scaleY)
                }
            }),
            tweenTo(label, {
                y: chest.sprite.baseY - 14,
                alpha: 1,
                duration: Config.CHEST_OPEN_DURATION_MS / 1000,
                ease: "back.out(1.8)"
            }),
            tweenTo(label.scale, {
                x: 1,
                y: 1,
                duration: Config.CHEST_OPEN_DURATION_MS / 1000,
                ease: "back.out(1.8)"
            })
        ])
    }, [getTexture, playSound, spawnParticles])

    const bouncePickaxe = useCallback(async (pickaxe: Sprite, groundY: number, rotation: number) => {
        const riseY = groundY - Config.CELL_SIZE_PX * 0.72
        const halfDuration = Config.PICKAXE_BOUNCE_DURATION_MS / 2400

        await tweenTo(pickaxe, {
            keyframes: [
                {
                    y: riseY,
                    rotation: rotation + Math.PI,
                    duration: halfDuration,
                    ease: "sine.out"
                },
                {
                    y: groundY,
                    rotation: rotation + Math.PI * 2,
                    duration: halfDuration,
                    ease: "sine.in"
                }
            ]
        })

        return pickaxe.rotation
    }, [])

    const runPickaxe = useCallback(async (slotIndex: number, field: Field) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const col = slotIndex % Config.COLS
        const slotRow = Math.floor(slotIndex / Config.COLS)
        const pickaxeKey = field.pickaxes[slotRow]?.[col]
        const pickaxeCfg = pickaxeKey ? Config.PICKAXES[pickaxeKey] : null
        const slot = runtime.pickaxeSlots[slotIndex]
        if (!pickaxeKey || !pickaxeCfg || !slot?.sprite) return

        let hp = pickaxeCfg.health
        const pickaxe = slot.sprite
        const startX = col * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX) + Config.CELL_SIZE_PX / 2
        let currentY: number
        let rotation = 0

        for (let row = 0; row < Config.ROWS; row++) {
            const block = runtime.blocks[row]?.[col]
            if (!block || hp <= 0) continue

            const blockCfg = Config.BLOCKS[block.key]
            const blockTopY = BLOCKS_Y + row * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX)
            const targetY = blockTopY - PICKAXE_HIT_CENTER_OFFSET_Y

            await tweenTo(pickaxe, {
                y: targetY,
                rotation: rotation + Math.PI * 2 * Config.PICKAXE_FALL_SPINS,
                duration: Config.PICKAXE_FALL_DURATION_MS / 1000,
                ease: "power2.in"
            })
            currentY = targetY
            rotation = pickaxe.rotation

            while (hp > 0 && block.hp > 0) {
                const damage = Math.min(hp, Math.max(1, Math.ceil(blockCfg.health / 3)), block.hp)
                hp -= damage
                block.hp -= damage
                const brokeBlock = block.hp <= 0
                const brokePickaxe = hp <= 0

                playSound(blockCfg.sound.hit)
                spawnParticles(block.sprite.baseX, block.sprite.baseY, blockCfg.color, brokeBlock ? 18 : 8)
                updateCrackOverlay(block)
                await shakeBlock(block, brokeBlock)

                if (brokeBlock) {
                    playSound(blockCfg.sound.break)
                    block.sprite.destroy()
                    block.border.destroy()
                    block.crack.destroy()
                    runtime.blocks[row][col] = null
                }

                if (brokePickaxe) {
                    playSound(pickaxeCfg.sound.break)
                    spawnParticles(startX - Config.CELL_SIZE_PX / 2, currentY - Config.CELL_SIZE_PX / 2, pickaxeCfg.color, 20)
                    pickaxe.destroy()
                    slot.sprite = null
                    await wait(140)
                    break
                }

                if (brokeBlock) {
                    break
                }

                rotation = await bouncePickaxe(pickaxe, currentY, rotation)
                await wait(Config.PICKAXE_BETWEEN_HIT_DELAY_MS)
            }
        }

        const isColumnClear = runtime.blocks.every(row => !row[col])
        if (isColumnClear) {
            if (slot.sprite) {
                await tweenTo(slot.sprite, {
                    alpha: 0,
                    duration: 0.14,
                    ease: "power2.out",
                    onComplete: () => {
                        slot.sprite?.destroy()
                        slot.sprite = null
                    }
                })
            }
            await openChest(col)
            return
        }

        if (slot.sprite) {
            await tweenTo(slot.sprite, {
                x: startX,
                y: slotRow * (Config.CELL_SIZE_PX + Config.PICKAXES_GRID_GAP_Y_PX) + Config.CELL_SIZE_PX / 2,
                rotation: 0,
                duration: 0.22,
                ease: "power2.out"
            })
        }
    }, [bouncePickaxe, openChest, playSound, shakeBlock, spawnParticles, updateCrackOverlay])

    const spinPickaxes = useCallback(async (field: Field) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const pickaxeKeys = Object.keys(Config.PICKAXES)
        const reelKeys: (string | null)[] = [...pickaxeKeys, null]
        let lastSpinSoundAt = 0
        const promises = runtime.pickaxeSlots.map((slot, slotIndex) => new Promise<void>(resolve => {
            const sprite = slot.sprite
            const row = Math.floor(slotIndex / Config.COLS)
            const col = slotIndex % Config.COLS
            const targetKey = field.pickaxes[row]?.[col] ?? null
            const targetReelKey = targetKey && Config.PICKAXES[targetKey] ? targetKey : null
            const slotX = col * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX)
            const slotY = row * (Config.CELL_SIZE_PX + Config.PICKAXES_GRID_GAP_Y_PX)
            const centerY = slotY + Config.CELL_SIZE_PX / 2
            const targetKeyIndex = reelKeys.indexOf(targetReelKey)

            if (!sprite) {
                resolve()
                return
            }

            sprite.visible = false

            const reel = new Container()
            const reelMask = new Graphics()
                .rect(slotX + 1, slotY + 1, Config.CELL_SIZE_PX - 2, Config.CELL_SIZE_PX - 2)
                .fill(0xffffff)
            reelMask.alpha = 0
            const getReelKey = (index: number) => reelKeys[index % reelKeys.length]
            const applyReelKey = (reelSprite: Sprite, key: string | null) => {
                if (!key) {
                    reelSprite.texture = Texture.EMPTY
                    reelSprite.visible = false
                    return
                }

                reelSprite.texture = getTexture(Config.PICKAXES[key].texture)
                reelSprite.visible = true
                reelSprite.alpha = 1
            }
            const first = setupPickaxeSprite(new Sprite(Texture.EMPTY), slotX, slotY)
            const second = setupPickaxeSprite(new Sprite(Texture.EMPTY), slotX, slotY)
            applyReelKey(first, getReelKey(slotIndex))
            applyReelKey(second, getReelKey(slotIndex + 1))
            const spinDuration = (Config.SLOT_SPIN_DURATION_MS + slotIndex * Config.SLOT_STOP_STAGGER_MS) / 1000
            const totalSteps = Math.max(4, Math.ceil(spinDuration * 5))
            const spinState = {
                offset: 0,
                firstKeyIndex: slotIndex % reelKeys.length,
                secondKeyIndex: (slotIndex + 1) % reelKeys.length,
                step: 0
            }

            reel.addChild(first, second)
            reel.mask = reelMask
            runtime.pickaxesLayer.addChild(reelMask, reel)

            const updateReel = () => {
                const nextStep = Math.floor(spinState.offset / Config.CELL_SIZE_PX)

                if (nextStep > spinState.step) {
                    const now = performance.now()
                    const isSettlingToResult = nextStep >= totalSteps - 1
                    if (!isSettlingToResult && now - lastSpinSoundAt >= SPIN_SOUND_MIN_INTERVAL_MS) {
                        lastSpinSoundAt = now
                        stopSound(Config.SPINNING_SOUND)
                        playSound(Config.SPINNING_SOUND, SPIN_SOUND_PLAY_MS)
                    }

                    spinState.firstKeyIndex = spinState.secondKeyIndex
                    spinState.secondKeyIndex = nextStep >= totalSteps - 1
                        ? targetKeyIndex
                        : Math.floor(Math.random() * reelKeys.length)

                    if (nextStep >= totalSteps) {
                        spinState.firstKeyIndex = targetKeyIndex
                    }

                    applyReelKey(first, reelKeys[spinState.firstKeyIndex])
                    applyReelKey(second, reelKeys[spinState.secondKeyIndex])
                    spinState.step = nextStep
                }

                const localOffset = spinState.offset - spinState.step * Config.CELL_SIZE_PX
                first.y = centerY + localOffset
                second.y = centerY + localOffset - Config.CELL_SIZE_PX
                first.rotation = Math.sin(localOffset / Config.CELL_SIZE_PX * Math.PI) * 0.08
                second.rotation = first.rotation
            }

            const spinTween = gsap.to(spinState, {
                offset: Config.CELL_SIZE_PX * totalSteps,
                duration: spinDuration,
                ease: "power3.out",
                onUpdate: updateReel,
                onComplete: () => {
                    if (targetReelKey) {
                        first.texture = getTexture(Config.PICKAXES[targetReelKey].texture)
                        first.visible = true
                        first.y = centerY
                        first.rotation = 0
                    }

                    reel.destroy({ children: true })
                    reelMask.destroy()

                    if (!targetReelKey) {
                        sprite.destroy()
                        slot.sprite = null
                        resolve()
                        return
                    }

                    sprite.visible = true
                    sprite.texture = getTexture(Config.PICKAXES[targetReelKey].texture)
                    sprite.alpha = 1
                    setupPickaxeSprite(sprite, slotX, slotY)
                    resolve()
                }
            })
            runtime.spinTweens.push(spinTween)

            window.setTimeout(() => {
                if (!spinTween.isActive()) return
                spinTween.progress(1)
            }, Config.SLOT_SPIN_DURATION_MS + slotIndex * Config.SLOT_STOP_STAGGER_MS + 60)

            updateReel()
        }))

        await Promise.all(promises)
        stopSound(Config.SPINNING_SOUND)
    }, [getTexture, playSound, setupPickaxeSprite, stopSound])

    const playRound = useCallback(async (result: MinerResult, playId: number, bet: number) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        fieldRef.current = result.field
        runtime.isAnimating = true
        drawIdleScene(result.field)
        await spinPickaxes(result.field)
        stopSound(Config.SPINNING_SOUND)

        for (let row = 0; row < Config.PICKAXES_ROWS; row++) {
            await Promise.all(Array.from({ length: Config.COLS }, (_, col) => runPickaxe(row * Config.COLS + col, result.field)))
            if (row < Config.PICKAXES_ROWS - 1) await wait(Config.PICKAXE_ROW_PAUSE_MS)
        }

        if (playId !== playIdRef.current) return

        flushBalanceUpdate()
        data?.pushHistory(Math.trunc((result.isWin ? bet * result.multiplier : 0) - bet))
        if (result.isWin) {
            data?.setWinAmount(formatWinAmount(bet, result.multiplier))
            data?.StateMachine.changeState("WIN")
        } else {
            data?.setWinAmount(0)
            data?.StateMachine.changeState("IDLE")
        }
        runtime.isAnimating = false
    }, [data, drawIdleScene, flushBalanceUpdate, runPickaxe, spinPickaxes, stopSound])

    const play = useCallback(async (bet?: number) => {
        if (!account || !data || runtimeRef.current?.isAnimating) return

        const runtime = runtimeRef.current
        if (!runtime) return

        const playId = ++playIdRef.current
        const betAmount = bet ?? data.bet
        let isBetDebited = false
        runtime.isAnimating = true
        data.StateMachine.changeState("PLAYING")

        try {
            incrementBalance(-betAmount)
            isBetDebited = true
            const result = await GameApi.playMiner(account.UUID, betAmount)
            if (playId !== playIdRef.current) return
            queueBalanceUpdate(result.newBalance)
            await playRound(result, playId, betAmount)
        } catch {
            if (isBetDebited) {
                incrementBalance(betAmount)
            }
            runtime.isAnimating = false
            data.StateMachine.changeState("IDLE")
            toast.error("Не удалось запустить Майнер")
        }
    }, [account, data, incrementBalance, playRound, queueBalanceUpdate])

    useImperativeHandle(ref, () => ({ play }), [play])

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

            const root = new Container()
            const runtime: Runtime = {
                app,
                root,
                slotsLayer: new Container(),
                blocksLayer: new Container(),
                chestsLayer: new Container(),
                pickaxesLayer: new Container(),
                effectsLayer: new Container(),
                labelLayer: new Container(),
                pickaxeSlots: [],
                blocks: [],
                chests: [],
                spinTweens: [],
                glowTweens: [],
                audioPools: new Map(),
                resizeObserver: null,
                isAnimating: false
            }

            root.addChild(runtime.slotsLayer, runtime.blocksLayer, runtime.chestsLayer, runtime.pickaxesLayer, runtime.effectsLayer, runtime.labelLayer)
            app.stage.addChild(root)
            runtimeRef.current = runtime

            const imageAssets = [
                Config.SLOT_TEXTURE,
                Config.BACKGROUND_TEXTURE,
                ...Config.BREAK_TEXTURE,
                ...Object.values(Config.BLOCKS).map(item => item.texture),
                ...Object.values(Config.PICKAXES).map(item => item.texture),
                ...Object.values(Config.CHESTS).flatMap(item => [item.texture, item.opened_texture, item.glow_texture])
            ]

            await Assets.load(imageAssets.map(pixelAsset))

            drawIdleScene()
            runtime.resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(resizeScene)
            })
            runtime.resizeObserver.observe(host)
            resizeScene()
        }

        void init()

        return () => {
            destroyed = true
            const runtime = runtimeRef.current
            runtime?.resizeObserver?.disconnect()
            cleanupScene()
            runtimeRef.current = null
            if (host.contains(app.canvas)) host.removeChild(app.canvas)
            app.destroy(true)
        }
    }, [cleanupScene, drawIdleScene, resizeScene])

    return (
        <div className={styles.miner} style={{ backgroundImage: `url(${Config.BACKGROUND_TEXTURE})` }}>
            <div ref={hostRef} className={styles.stage} />
        </div>
    )
})

export default memo(Miner)
