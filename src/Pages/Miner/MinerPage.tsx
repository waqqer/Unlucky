import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"

const MinerPage = () => {
    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameControlls openAbout={() => {}}/>
                <GameContainer type="triple" demo={false} autoreroll={false} />
            </Section>
        </Page>
    )
}

export default memo(MinerPage)