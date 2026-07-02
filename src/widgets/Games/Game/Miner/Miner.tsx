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
    crack: Sprite
}

type Runtime = {
    app: Application
    root: Container
    slotsLayer: Container
    blocksLayer: Container
    chestsLayer: Container
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
const SECTION_GAP = 18
const WORLD_WIDTH = Config.COLS * Config.CELL_SIZE_PX + (Config.COLS - 1) * Config.GRID_GAP_PX
const PICKAXES_HEIGHT = Config.PICKAXES_ROWS * Config.CELL_SIZE_PX + (Config.PICKAXES_ROWS - 1) * Config.GRID_GAP_PX
const BLOCKS_HEIGHT = Config.ROWS * Config.CELL_SIZE_PX + (Config.ROWS - 1) * Config.GRID_GAP_PX
const CHESTS_HEIGHT = CHEST_ROWS * Config.CELL_SIZE_PX
const BLOCKS_Y = PICKAXES_HEIGHT + SECTION_GAP
const CHESTS_Y = BLOCKS_Y + BLOCKS_HEIGHT + SECTION_GAP
const WORLD_HEIGHT = CHESTS_Y + CHESTS_HEIGHT

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

const getCellPosition = (row: number, col: number, yOffset = 0) => ({
    x: col * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX),
    y: yOffset + row * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX)
})

const formatMultiplier = (value: number) => {
    const rounded = Math.floor(value * 100) / 100
    return `x${rounded.toFixed(2).replace(/\.?0+$/, "")}`
}

const Miner = forwardRef<GameRef, GameProps>((props, ref) => {
    const { data } = props
    const hostRef = useRef<HTMLDivElement>(null)
    const runtimeRef = useRef<Runtime | null>(null)
    const fieldRef = useRef<Field | null>(null)
    const playIdRef = useRef(0)

    const { account } = useContext(AuthContext)
    const { setBalanceTo } = useContext(AccountContext)

    const getTexture = useCallback((src: string) => {
        return Assets.get<Texture>(src) || Texture.from(src)
    }, [])

    const playSound = useCallback((src?: string) => {
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

        audio.currentTime = 0
        audio.volume = Config.SOUND_VOLUME
        void audio.play().catch(() => undefined)
    }, [])

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

    const resizeScene = useCallback(() => {
        const host = hostRef.current
        const runtime = runtimeRef.current
        if (!host || !runtime) return

        const width = Math.max(1, host.clientWidth)
        const height = Math.max(1, host.clientHeight)
        const scale = Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT)

        runtime.root.scale.set(scale)
        runtime.root.x = (width - WORLD_WIDTH * scale) / 2
        runtime.root.y = (height - WORLD_HEIGHT * scale) / 2
    }, [])

    const cleanupScene = useCallback(() => {
        const runtime = runtimeRef.current
        if (!runtime) return

        runtime.spinTweens.forEach(tween => tween.kill())
        runtime.glowTweens.forEach(tween => tween.kill())
        gsap.killTweensOf(runtime.root.children)
        runtime.audioPools.forEach(pool => pool.forEach(audio => {
            audio.pause()
            audio.currentTime = 0
        }))
    }, [])

    const spawnParticles = useCallback((x: number, y: number, color: string, count = 14, glowTexture?: string) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        for (let index = 0; index < count; index++) {
            const particle = glowTexture
                ? new Sprite(getTexture(glowTexture))
                : new Graphics().circle(0, 0, 3 + Math.random() * 3).fill(color)

            particle.x = x + Config.CELL_SIZE_PX / 2
            particle.y = y + Config.CELL_SIZE_PX / 2
            particle.alpha = 0.95
            particle.scale.set(glowTexture ? 0.22 + Math.random() * 0.22 : 1)
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
        await tweenTo(block.sprite, {
            x: block.sprite.baseX + amplitude,
            y: block.sprite.baseY - 1,
            yoyo: true,
            repeat: 3,
            duration: 0.035,
            ease: "sine.inOut",
            onComplete: () => {
                block.sprite.x = block.sprite.baseX
                block.sprite.y = block.sprite.baseY
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
                particle.alpha = 0.85
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
        runtime.effectsLayer.removeChildren()
        runtime.labelLayer.removeChildren()

        const pickaxeKeys = Object.keys(Config.PICKAXES)
        const blockKeys = Object.keys(Config.BLOCKS)

        for (let row = 0; row < Config.PICKAXES_ROWS; row++) {
            for (let col = 0; col < Config.COLS; col++) {
                const { x, y } = getCellPosition(row, col)
                const slot = createSprite(Config.SLOT_TEXTURE, x, y, runtime.slotsLayer)
                const key = field?.pickaxes[row]?.[col] || pickaxeKeys[(row * Config.COLS + col) % pickaxeKeys.length]
                const sprite = key ? createSprite(Config.PICKAXES[key]?.texture, x, y, runtime.slotsLayer) : null
                if (sprite) {
                    sprite.anchor.set(0.5)
                    sprite.x += Config.CELL_SIZE_PX / 2
                    sprite.y += Config.CELL_SIZE_PX / 2
                    sprite.width = Config.CELL_SIZE_PX * 0.76
                    sprite.height = Config.CELL_SIZE_PX * 0.76
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
                const crack = createSprite(Config.BREAK_TEXTURE[0], x, y, runtime.blocksLayer, 0)
                runtime.blocks[row][col] = { key, hp: cfg.health, maxHp: cfg.health, sprite, crack }
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
    }, [addChestGlow, cleanupScene, createSprite, resizeScene])

    const openChest = useCallback(async (col: number) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const chest = runtime.chests[col]
        if (!chest || chest.opened || chest.data.multiplier === -1) return

        const cfg = Config.CHESTS[chest.data.quality] || Config.CHESTS.common
        chest.opened = true
        chest.sprite.texture = getTexture(cfg.opened_texture)
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

        spawnParticles(chest.sprite.baseX, chest.sprite.baseY, cfg.color, cfg.glow ? 20 : 10, cfg.glow ? cfg.glow_texture : undefined)

        await Promise.all([
            tweenTo(chest.sprite.scale, {
                x: 1.12,
                y: 1.12,
                yoyo: true,
                repeat: 1,
                duration: Config.CHEST_OPEN_DURATION_MS / 2000,
                ease: "back.out(2)"
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
        let currentY = slotRow * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX) + Config.CELL_SIZE_PX / 2
        let rotation = 0

        for (let row = 0; row < Config.ROWS; row++) {
            const block = runtime.blocks[row]?.[col]
            if (!block || hp <= 0) continue

            const blockCfg = Config.BLOCKS[block.key]
            const targetY = BLOCKS_Y + row * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX) + Config.CELL_SIZE_PX * 0.1

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
                    await tweenTo(pickaxe, {
                        y: currentY - Config.CELL_SIZE_PX * 0.34,
                        rotation: rotation + Math.PI * 0.44,
                        yoyo: true,
                        repeat: 1,
                        duration: 0.075,
                        ease: "sine.out"
                    })
                    currentY = pickaxe.y
                    rotation = pickaxe.rotation
                    break
                }

                await tweenTo(pickaxe, {
                    y: currentY - Config.CELL_SIZE_PX * 0.8,
                    rotation: rotation + Math.PI * 2,
                    yoyo: true,
                    repeat: 1,
                    duration: Config.PICKAXE_BOUNCE_DURATION_MS / 2000,
                    ease: "sine.out"
                })
                currentY = pickaxe.y
                rotation = pickaxe.rotation
                await wait(Config.PICKAXE_BETWEEN_HIT_DELAY_MS)
            }
        }

        if (slot.sprite) {
            await tweenTo(slot.sprite, {
                x: startX,
                y: slotRow * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX) + Config.CELL_SIZE_PX / 2,
                rotation: 0,
                duration: 0.22,
                ease: "power2.out"
            })
        }

        const isColumnClear = runtime.blocks.every(row => !row[col])
        if (isColumnClear) await openChest(col)
    }, [openChest, playSound, shakeBlock, spawnParticles, updateCrackOverlay])

    const spinPickaxes = useCallback(async (field: Field) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        const pickaxeKeys = Object.keys(Config.PICKAXES)
        const promises = runtime.pickaxeSlots.map((slot, slotIndex) => new Promise<void>(resolve => {
            const sprite = slot.sprite
            const row = Math.floor(slotIndex / Config.COLS)
            const col = slotIndex % Config.COLS
            const targetKey = field.pickaxes[row]?.[col]

            if (!sprite) {
                resolve()
                return
            }

            const swapTween = gsap.to(sprite, {
                y: sprite.y + Config.CELL_SIZE_PX,
                duration: 0.11,
                repeat: -1,
                ease: "none",
                onRepeat: () => {
                    const randomKey = pickaxeKeys[Math.floor(Math.random() * pickaxeKeys.length)]
                    sprite.texture = getTexture(Config.PICKAXES[randomKey].texture)
                    sprite.y -= Config.CELL_SIZE_PX
                }
            })
            runtime.spinTweens.push(swapTween)

            window.setTimeout(() => {
                swapTween.kill()
                if (!targetKey) {
                    sprite.visible = false
                    slot.sprite = null
                    resolve()
                    return
                }

                sprite.visible = true
                sprite.texture = getTexture(Config.PICKAXES[targetKey].texture)
                sprite.y = row * (Config.CELL_SIZE_PX + Config.GRID_GAP_PX) + Config.CELL_SIZE_PX / 2
                gsap.fromTo(sprite, { y: sprite.y - 9 }, {
                    y: sprite.y,
                    duration: 0.18,
                    ease: "bounce.out",
                    onComplete: () => resolve()
                })
            }, Config.SLOT_SPIN_DURATION_MS + slotIndex * Config.SLOT_STOP_STAGGER_MS)
        }))

        await Promise.all(promises)
    }, [getTexture])

    const playRound = useCallback(async (result: MinerResult, playId: number) => {
        const runtime = runtimeRef.current
        if (!runtime) return

        fieldRef.current = result.field
        runtime.isAnimating = true
        drawIdleScene(result.field)
        await spinPickaxes(result.field)

        for (let row = 0; row < Config.PICKAXES_ROWS; row++) {
            await Promise.all(Array.from({ length: Config.COLS }, (_, col) => runPickaxe(row * Config.COLS + col, result.field)))
            if (row < Config.PICKAXES_ROWS - 1) await wait(Config.PICKAXE_ROW_PAUSE_MS)
        }

        if (playId !== playIdRef.current) return

        setBalanceTo(result.newBalance)
        data?.StateMachine.changeState(result.isWin ? "WIN" : "IDLE")
        runtime.isAnimating = false
    }, [data, drawIdleScene, runPickaxe, setBalanceTo, spinPickaxes])

    const play = useCallback(async (bet?: number) => {
        if (!account || !data || runtimeRef.current?.isAnimating) return

        const runtime = runtimeRef.current
        if (!runtime) return

        const playId = ++playIdRef.current
        data.StateMachine.changeState("PLAYING")

        try {
            const result = await GameApi.playMiner(account.UUID, bet ?? data.bet)
            if (playId !== playIdRef.current) return
            await playRound(result, playId)
        } catch {
            runtime.isAnimating = false
            data.StateMachine.changeState("IDLE")
            toast.error("Не удалось запустить Майнер")
        }
    }, [account, data, playRound])

    useImperativeHandle(ref, () => ({ play }), [play])

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        let destroyed = false
        const app = new Application()

        const init = async () => {
            await app.init({
                backgroundAlpha: 0,
                antialias: true,
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

            root.addChild(runtime.slotsLayer, runtime.blocksLayer, runtime.chestsLayer, runtime.effectsLayer, runtime.labelLayer)
            app.stage.addChild(root)
            runtimeRef.current = runtime

            await Assets.load([
                Config.SLOT_TEXTURE,
                Config.BACKGROUND_TEXTURE,
                ...Config.BREAK_TEXTURE,
                ...Object.values(Config.BLOCKS).map(item => item.texture),
                ...Object.values(Config.PICKAXES).map(item => item.texture),
                ...Object.values(Config.CHESTS).flatMap(item => [item.texture, item.opened_texture, item.glow_texture])
            ])

            drawIdleScene()
            runtime.resizeObserver = new ResizeObserver(resizeScene)
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
