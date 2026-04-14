import { useRef, useEffect, useCallback, useState } from "react"
import styles from "./RocketGraph.module.css"
import rocketImg from "@/shared/images/games/rocket/rocket.webp"

const ROCKET_SIZE = 64
const ROCKET_ANGLE_OFFSET = 45

const RocketGraph = ({ multiplier, isCrashed, isFlying, crashedPoint }) => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const dimensionsRef = useRef({ width: 600, height: 400 })
    const animationFrameRef = useRef(null)
    const rocketImageRef = useRef(null)
    const [imageReady, setImageReady] = useState(false)

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
        const startX = 20
        const startY = height - 20

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
        const targetMultiplier = isCrashed ? crashedPoint : currentMult
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
        } else if (imageReady && rocketImageRef.current) {
            const fixedAngle = ROCKET_ANGLE_OFFSET * Math.PI / 180

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
    }, [multiplier, isCrashed, isFlying, crashedPoint, imageReady])

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
