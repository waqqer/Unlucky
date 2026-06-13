import { memo, useCallback } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import { useNavigate } from "react-router"

const NotFoundPage = () => {
    const nav = useNavigate()

    const handleClick = useCallback(() => {
        nav("/")
    }, [])
    
    return (
        <Page>
            <ParticleBackground />
        </Page>
    )
}

export default memo(NotFoundPage)