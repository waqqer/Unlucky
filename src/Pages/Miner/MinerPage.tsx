import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer from "@/widgets/Games/Layout/GameContainer"

const MinerPage = () => {
    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameContainer type="triple"/>
            </Section>
        </Page>
    )
}

export default memo(MinerPage)