import { memo, useRef, useCallback } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer, { type GameContainerRef } from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Window from "@/Components/Containers/Window"
import useModal from "@/Hooks/useModal"
import type { GameRef } from "@/Shared/Types/GameTypes"

const SlotsPage = () => {
    const about = useModal()

    const gameContainerRef = useRef<GameContainerRef>(null)
    const gameRef = useRef<GameRef>(null)

    const handlePlay = useCallback((bet: number) => {
        if (gameRef.current && gameContainerRef.current) {
            if (gameContainerRef.current.isDemo) {
                gameRef.current.playDemo?.()
                return
            }
            gameRef.current.play()
            return
        }
    }, [])


    return (
        <>
            <Page>
                <ParticleBackground />

                <Section justify="center" align="center">
                    <GameControlls openAbout={about.open} />
                    <GameContainer type="double" onPlay={handlePlay}>

                    </GameContainer>
                </Section>
            </Page>

            <Window isOpen={about.isOpen} close={about.close}>
                <h2>Hello</h2>
            </Window>
        </>
    )
}

export default memo(SlotsPage)