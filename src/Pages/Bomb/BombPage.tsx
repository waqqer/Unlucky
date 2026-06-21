import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"

const BombPage = () => {
    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameControlls openAbout={() => {}} />
                <GameContainer type="double">
                </GameContainer>
            </Section>
        </Page>
    )
}

export default memo(BombPage)