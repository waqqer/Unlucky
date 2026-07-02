import { memo, useRef, useCallback, useEffect, useState } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer, { type GameContainerRef } from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Miner from "@/widgets/Games/Game/Miner"
import { type GameRef } from "@/Shared/Types/GameTypes"
import { toast } from "react-toastify"

const MinerPage = () => {
    const containerRef = useRef<GameContainerRef>(null)
    const gameRef = useRef<GameRef>(null)
    const [gameData, setGameData] = useState<GameContainerRef | null>(null)

    useEffect(() => {
        setGameData(containerRef.current)
    }, [])

    const handlePlay = useCallback((bet: number) => {
        const container = containerRef.current
        if (!container) return

        if (container.isAutoreroll || container.isDemo) {
            toast.error("В игре майнер не доступен Авто-реролл и Демо режим")
            return
        }
        if (gameRef.current)
            gameRef.current.play(bet)
    }, [])

    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameControlls openAbout={() => { }} />
                <GameContainer type="triple" demo={false} autoreroll={false} ref={containerRef} onPlay={handlePlay}>
                    <Miner data={gameData} ref={gameRef} />
                </GameContainer>
            </Section>
        </Page>
    )
}

export default memo(MinerPage)
