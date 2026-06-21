import { useEffect, useRef, useState } from "react"

interface CounterConfig {
    duration?: number
    onEnd?: () => void
}

const useCounter = (target: number, config?: CounterConfig): number => {
    const {
        duration = 2000,
        onEnd
    } = config || {}

    const [current, setCurrent] = useState<number>(0)

    const startTimeRef = useRef<number>(null)
    const animationRef = useRef<number>(null)
    const onEndRef = useRef<(() => void)>(onEnd)

    useEffect(() => {
        onEndRef.current = onEnd
    }, [onEnd])

    useEffect(() => {
        setCurrent(0)
        startTimeRef.current = null

        const animate = (timestamp: number) => {
            if(!startTimeRef.current) {
                startTimeRef.current = timestamp
            }

            const progress = timestamp - startTimeRef.current
            const progressPerc = Math.min(progress / duration, 1)

            const easedProgress = 1 - Math.pow(1 - progressPerc, 3)
            const currentValue = Math.round(easedProgress * target)

            setCurrent(currentValue)

            if(progressPerc < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                setCurrent(target)
                
                if(onEndRef.current)
                    onEndRef.current()
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if(animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [target, duration])

    return current
}

export default useCounter