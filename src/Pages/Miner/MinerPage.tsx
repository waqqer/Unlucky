import { memo, useRef, useCallback, useEffect, useState, useContext } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer, { type GameContainerRef, type GameState } from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Miner from "@/widgets/Games/Game/Miner"
import { type GameRef } from "@/Shared/Types/GameTypes"
import { toast } from "react-toastify"
import { AccountContext } from "@/Context/AccountContext"

const MinerPage = () => {
    const containerRef = useRef<GameContainerRef>(null)
    const gameRef = useRef<GameRef>(null)
    const [gameData, setGameData] = useState<GameContainerRef | null>(null)
    const [isMenuDisabled, setIsMenuDisabled] = useState(false)
    const {
        beginBalanceDeferral,
        endBalanceDeferral,
        flushBalanceUpdate
    } = useContext(AccountContext)

    useEffect(() => {
        setGameData(containerRef.current)
    }, [])

    useEffect(() => {
        beginBalanceDeferral()

        return () => {
            endBalanceDeferral()
        }
    }, [beginBalanceDeferral, endBalanceDeferral])

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

    const handleGameStateChange = useCallback((state: GameState) => {
        setIsMenuDisabled(state !== "IDLE")
    }, [])

    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameControlls openAbout={() => { }} onMenuClick={flushBalanceUpdate} isMenuDisabled={isMenuDisabled} />
                <GameContainer type="triple" demo={false} autoreroll={false} ref={containerRef} onPlay={handlePlay} onStateChange={handleGameStateChange}>
                    <Miner data={gameData} ref={gameRef} />
                </GameContainer>
            </Section>
        </Page>
    )
}

export default memo(MinerPage)
