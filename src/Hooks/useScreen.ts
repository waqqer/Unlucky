import { useEffect, useState } from "react"

interface ScreenSizeInfo {
    isMobile: boolean
    isPC: boolean
    isTablet: boolean
    width: number
    heigth: number
}

const useScreen = (): ScreenSizeInfo => {
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [heigth, setHeight] = useState<number>(window.innerHeight)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return {
        width,
        heigth,

        isMobile: width <= 700,
        isTablet: width <= 1000,
        isPC: width > 1000
    }
}

export default useScreen