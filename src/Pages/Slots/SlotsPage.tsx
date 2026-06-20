import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Window from "@/Components/Containers/Window"
import useModal from "@/Hooks/useModal"

const SlotsPage = () => {
    const about = useModal()

    return (
        <>
            <Page>
                <ParticleBackground />

                <Section justify="center" align="center">
                    <GameControlls openAbout={about.open} />
                    <GameContainer type="double">
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