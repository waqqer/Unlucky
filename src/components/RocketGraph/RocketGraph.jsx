import { useRef, useEffect, useCallback, useState } from "react"
import styles from "./RocketGraph.module.css"
import rocketImg from "@/shared/images/games/rocket/rocket.webp"
import { ROCKET_CONFIG } from "@/shared/configs"

const {
    VISUAL: {
        GRAPH: { ROCKET_SIZE, ROCKET_ANGLE_OFFSET, START_PADDING },
        SMOKE: {
            ENABLED: SMOKE_ENABLED,
            SPRITES: SMOKE_SPRITES,
            PARTICLE_COUNT,
            BASE_SIZE: PARTICLE_BASE_SIZE,
            ALPHA: PARTICLE_ALPHA,
            SPACING: PARTICLE_SPACING,
            SPEED: PARTICLE_SPEED,
            BASE_BACK: PARTICLE_BASE_BACK,
            MAX_BACK: PARTICLE_MAX_BACK,
            SIDE_SPREAD,
            DRIFT,
            ROTATION_SPEED,
            ENGINE_OFFSET_X,
            ENGINE_OFFSET_Y,
            DIRECTION_ANGLE_OFFSET
        },
        EXPLOSION: {
            ENABLED: EXPLOSION_ENABLED,
            DURATION_MS: EXPLOSION_DURATION_MS,
            SPRITES: EXPLOSION_SPRITES,
            PARTICLE_COUNT: EXPLOSION_PARTICLE_COUNT,
            BASE_SIZE: EXPLOSION_BASE_SIZE,
            ALPHA: EXPLOSION_ALPHA,
            SPEED: EXPLOSION_SPEED,
            SPREAD: EXPLOSION_SPREAD,
            ROTATION_SPEED: EXPLOSION_ROTATION_SPEED
        }
    }
} = ROCKET_CONFIG

const RocketGraph = ({ multiplier, isCrashed, isFlying, crashedPoint, hasCashedOut }) => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const dimensionsRef = useRef({ width: 600, height: 400 })
    const animationFrameRef = useRef(null)
    const rocketImageRef = useRef(null)
    const smokeSpriteImagesRef = useRef([])
    const explosionSpriteImagesRef = useRef([])
    const particleSeedsRef = useRef([])
    const explosionSeedsRef = useRef([])
    const crashAtRef = useRef(null)
    const [imageReady, setImageReady] = useState(false)
    const [spritesReady, setSpritesReady] = useState(false)
    const [frameTick, setFrameTick] = useState(0)

    useEffect(() => {
        const img = new Image()
        img.src = rocketImg
        img.onload = () => {
            rocketImageRef.current = img
            setImageReady(true)
        }
        img.onerror = () => {
            console.error("Failed to load rocket image")
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        const loadAll = async (sources) => {
            const imgs = await Promise.all(
                (sources || []).map((src) => new Promise((resolve) => {
                    const img = new Image()
                    img.src = src
                    img.onload = () => resolve({ ok: true, img })
                    img.onerror = () => resolve({ ok: false, img: null })
                }))
            )
            return imgs.filter(x => x.ok && x.img).map(x => x.img)
        }

        ;(async () => {
            const [smokeImgs, explosionImgs] = await Promise.all([
                loadAll(SMOKE_SPRITES),
                loadAll(EXPLOSION_SPRITES)
            ])
            if (cancelled) return

            smokeSpriteImagesRef.current = smokeImgs
            explosionSpriteImagesRef.current = explosionImgs
            setSpritesReady(true)

            if ((SMOKE_SPRITES?.length || 0) > 0 && smokeImgs.length === 0) {
                console.error("Failed to load smoke particle sprites")
            }
            if ((EXPLOSION_SPRITES?.length || 0) > 0 && explosionImgs.length === 0) {
                console.error("Failed to load explosion particle sprites")
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        // Stable random params for smoother smoke (no random jitter per frame).
        particleSeedsRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            i,
            spriteIndex: Math.floor(Math.random() * Math.max(1, (SMOKE_SPRITES?.length || 1))),
            phase: Math.random() * Math.PI * 2,
            drift: (Math.random() - 0.5) * 0.8,
            spread: (Math.random() - 0.5) * 1.2,
            rot: (Math.random() - 0.5) * 2,
            size: 0.8 + Math.random() * 0.8
        }))
    }, [PARTICLE_COUNT])

    const buildExplosionSeeds = useCallback(() => {
        // New random burst each crash (so the pattern doesn't repeat).
        const spriteCount = Math.max(1, (EXPLOSION_SPRITES?.length || 1))
        explosionSeedsRef.current = Array.from({ length: EXPLOSION_PARTICLE_COUNT }, (_, i) => {
            // Fully random direction with slight clustering variation.
            const angle = Math.random() * Math.PI * 2
            return {
                i,
                spriteIndex: Math.floor(Math.random() * spriteCount),
                angle,
                phase: Math.random() * Math.PI * 2,
                speedMul: 0.55 + Math.random() * 1.05,
                sizeMul: 0.6 + Math.random() * 1.2,
                rot: (Math.random() - 0.5) * 8,
                // Fixed per-particle jitter so motion is stable frame-to-frame.
                jitterX: (Math.random() - 0.5) * EXPLOSION_SPREAD,
                jitterY: (Math.random() - 0.5) * EXPLOSION_SPREAD
            }
        })
    }, [EXPLOSION_PARTICLE_COUNT, EXPLOSION_SPREAD, EXPLOSION_SPRITES])

    useEffect(() => {
        if (!isCrashed) return
        crashAtRef.current = performance.now()
        buildExplosionSeeds()

        // Force redraw for explosion duration (since props may stop updating after crash).
        let raf = null
        const loop = () => {
            if (!crashAtRef.current) return
            const elapsed = performance.now() - crashAtRef.current
            if (elapsed <= EXPLOSION_DURATION_MS) {
                setFrameTick(t => (t + 1) % 1000000)
                raf = requestAnimationFrame(loop)
            }
        }
        raf = requestAnimationFrame(loop)
        return () => {
            if (raf) cancelAnimationFrame(raf)
        }
    }, [isCrashed, EXPLOSION_DURATION_MS, buildExplosionSeeds])

    const updateDimensions = useCallback(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        if (!container || !canvas) return

        const rect = container.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        const width = Math.floor(rect.width)
        const height = Math.floor(rect.height)

        canvas.width = width * dpr
        canvas.height = height * dpr

        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext("2d")
        ctx.scale(dpr, dpr)

        dimensionsRef.current = { width, height }
    }, [])

    useEffect(() => {
        updateDimensions()

        let resizeTimeout = null

        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
                animationFrameRef.current = requestAnimationFrame(updateDimensions)
            }, 100)
        }

        const observer = new ResizeObserver(handleResize)

        const container = containerRef.current
        if (container) {
            observer.observe(container)
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("fullscreenchange", handleResize)

        return () => {
            observer.disconnect()
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("fullscreenchange", handleResize)
            if (resizeTimeout) clearTimeout(resizeTimeout)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [updateDimensions])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        const { width, height } = dimensionsRef.current

        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()

        const graphHeight = height - 40
        const graphWidth = width - 40
        const startX = START_PADDING
        const startY = height - START_PADDING

        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1

        for (let i = 0; i <= 5; i++) {
            const y = startY - (graphHeight * i) / 5
            ctx.beginPath()
            ctx.moveTo(startX, y)
            ctx.lineTo(startX + graphWidth, y)
            ctx.stroke()
        }

        if (!isFlying && !isCrashed) return

        const startMult = 0.7
        const currentMult = multiplier ?? startMult
        
        const targetMultiplier = (isCrashed && !hasCashedOut) ? crashedPoint : currentMult
        const progress = Math.min((targetMultiplier - startMult) / (10 - startMult), 1)

        const curveWidth = startX + graphWidth * progress
        const curveHeight = startY - graphHeight * progress

        const gradient = ctx.createLinearGradient(startX, startY, startX, startY - graphHeight)
        if (isCrashed) {
            gradient.addColorStop(0, "rgba(239, 68, 68, 0.05)")
            gradient.addColorStop(1, "rgba(239, 68, 68, 0.2)")
        } else {
            gradient.addColorStop(0, "rgba(100, 150, 255, 0.05)")
            gradient.addColorStop(1, "rgba(100, 150, 255, 0.2)")
        }

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo(
            startX + graphWidth * progress * 0.5,
            startY,
            curveWidth,
            curveHeight
        )
        ctx.lineTo(curveWidth, startY)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo(
            startX + graphWidth * progress * 0.5,
            startY,
            curveWidth,
            curveHeight
        )

        if (isCrashed) {
            ctx.strokeStyle = "#ef4444"
        } else {
            if (currentMult < 2) {
                ctx.strokeStyle = "#60a5fa"
            } else if (currentMult < 5) {
                ctx.strokeStyle = "#a78bfa"
            } else if (currentMult < 10) {
                ctx.strokeStyle = "#f472b6"
            } else {
                ctx.strokeStyle = "#fbbf24"
            }
        }

        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.stroke()

        if (isCrashed) {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8
                const distance = 15
                const px = curveWidth + Math.cos(angle) * distance
                const py = curveHeight + Math.sin(angle) * distance
                ctx.beginPath()
                ctx.arc(px, py, 3, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + Math.random() * 0.7})`
                ctx.fill()
            }

            // Explosion burst (visual only).
            if (EXPLOSION_ENABLED && spritesReady && explosionSpriteImagesRef.current.length > 0 && crashAtRef.current) {
                const tMs = performance.now() - crashAtRef.current
                const t = Math.max(0, Math.min(tMs / EXPLOSION_DURATION_MS, 1))
                const easeOut = 1 - Math.pow(1 - t, 3)
                const fade = 1 - t
                const elapsedSec = tMs / 1000

                for (const p of explosionSeedsRef.current) {
                    const sprite = explosionSpriteImagesRef.current[p.spriteIndex % explosionSpriteImagesRef.current.length]
                    const speed = EXPLOSION_SPEED * p.speedMul
                    // Radial blast from the crash point.
                    const dist = speed * elapsedSec * easeOut

                    // Keep a bit of initial randomness near the center, but fixed per particle.
                    const jitterFade = (1 - easeOut)
                    const x = curveWidth + Math.cos(p.angle) * dist + p.jitterX * jitterFade
                    const y = curveHeight + Math.sin(p.angle) * dist + p.jitterY * jitterFade

                    const size = EXPLOSION_BASE_SIZE * p.sizeMul * (0.9 + easeOut * 0.7)
                    const alpha = EXPLOSION_ALPHA * fade
                    if (alpha <= 0.001) continue

                    const rot = p.phase + performance.now() / 1000 * p.rot * (EXPLOSION_ROTATION_SPEED / 3)

                    ctx.save()
                    ctx.globalAlpha = alpha
                    ctx.translate(x, y)
                    ctx.rotate(rot)
                    ctx.drawImage(
                        sprite,
                        -size / 2,
                        -size / 2,
                        size,
                        size
                    )
                    ctx.restore()
                }
            }
        } else if (imageReady && rocketImageRef.current) {
            const fixedAngle = ROCKET_ANGLE_OFFSET * Math.PI / 180
            const smokeAngle = fixedAngle + (DIRECTION_ANGLE_OFFSET * Math.PI / 180)

            // Smoke particles behind the rocket (visual only).
            if (SMOKE_ENABLED && spritesReady && smokeSpriteImagesRef.current.length > 0) {
                // Important: smoke is positioned in rocket-local coords then rotated by ROCKET_ANGLE_OFFSET,
                // so it's always strictly "behind" the rocket relative to its tilt.
                const now = performance.now() / 1000
                const tailLength = Math.max(1, PARTICLE_COUNT) * PARTICLE_SPACING

                for (const p of particleSeedsRef.current) {
                    const sprite = smokeSpriteImagesRef.current[p.spriteIndex % smokeSpriteImagesRef.current.length]
                    const travel = (now * PARTICLE_SPEED + p.i * PARTICLE_SPACING) % tailLength
                    const t = travel / tailLength // 0..1 (near rocket -> far tail)

                    const back = Math.min(PARTICLE_BASE_BACK + travel, PARTICLE_MAX_BACK)
                    const size = PARTICLE_BASE_SIZE * p.size * (1 + t * 1.15)
                    const fade = 1 - t

                    // Local coords: X points forward along rocket tilt, so negative X is "behind".
                    const localX = ENGINE_OFFSET_X - back
                    // Invert lateral component so smoke sits "below" the rocket (as on the sprite).
                    const localY = ENGINE_OFFSET_Y - (
                        (p.spread * SIDE_SPREAD) * fade +
                        Math.sin(now * 2 + p.phase) * 2.5 * fade +
                        (p.drift * DRIFT) * fade
                    )

                    const alpha = PARTICLE_ALPHA * fade
                    if (alpha <= 0.001) continue

                    const rot = now * p.rot * ROTATION_SPEED + p.phase - (Math.PI / 4)

                    ctx.save()
                    ctx.globalAlpha = alpha
                    ctx.translate(curveWidth, curveHeight)
                    ctx.rotate(smokeAngle)
                    ctx.translate(localX, localY)
                    ctx.rotate(rot)
                    ctx.drawImage(
                        sprite,
                        -size / 2,
                        -size / 2,
                        size,
                        size
                    )
                    ctx.restore()
                }
            }

            ctx.save()
            ctx.translate(curveWidth, curveHeight)
            ctx.rotate(fixedAngle)
            ctx.shadowColor = "#60a5fa"
            ctx.shadowBlur = 15
            ctx.drawImage(
                rocketImageRef.current,
                -ROCKET_SIZE / 2,
                -ROCKET_SIZE / 2,
                ROCKET_SIZE,
                ROCKET_SIZE
            )
            ctx.restore()
            ctx.shadowBlur = 0
        } else {
            ctx.beginPath()
            ctx.arc(curveWidth, curveHeight, 6, 0, Math.PI * 2)
            ctx.fillStyle = "#60a5fa"
            ctx.shadowColor = "#60a5fa"
            ctx.shadowBlur = 10
            ctx.fill()
            ctx.shadowBlur = 0
        }

        if (isCrashed) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.1)"
            ctx.fillRect(0, 0, width, height)
        }
    }, [multiplier, isCrashed, isFlying, crashedPoint, imageReady, spritesReady, hasCashedOut, frameTick])

    return (
        <div ref={containerRef} className={styles["graph-container"]}>
            <canvas
                ref={canvasRef}
                className={styles["rocket-graph"]}
            />
        </div>
    )
}

export default RocketGraph
