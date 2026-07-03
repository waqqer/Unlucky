import { memo, useRef, useCallback, useState, useEffect, useContext } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer, { type GameContainerRef, type GameState } from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Window from "@/Components/Containers/Window"
import useModal from "@/Hooks/useModal"
import type { GameRef } from "@/Shared/Types/GameTypes"
import Slots from "@/widgets/Games/Game/Slots"
import { AccountContext } from "@/Context/AccountContext"
import Separator from "@/Components/Decorations/Separator"

const SlotsPage = () => {
    const about = useModal()

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
        if (gameRef.current && containerRef.current) {
            if (containerRef.current.isDemo) {
                gameRef.current.playDemo?.()
                return
            }
            gameRef.current.play(bet)
            return
        }
    }, [])

    const handleGameStateChange = useCallback((state: GameState) => {
        setIsMenuDisabled(state !== "IDLE")
    }, [])

    return (
        <>
            <Page>
                <ParticleBackground />

                <Section justify="center" align="center">
                    <GameControlls openAbout={about.open} onMenuClick={flushBalanceUpdate} isMenuDisabled={isMenuDisabled} />
                    <GameContainer type="double" ref={containerRef} onPlay={handlePlay} onStateChange={handleGameStateChange}>
                        <Slots data={gameData} ref={gameRef} />
                    </GameContainer>
                </Section>
            </Page>

            <Window isOpen={about.isOpen} close={about.close}>
                <div>
                    <h2>О игре "Слоты"</h2>
                    <Separator />
                    <p>
                        J buht
                    </p>
                </div>
            </Window>
        </>
    )
}

export default memo(SlotsPage)
