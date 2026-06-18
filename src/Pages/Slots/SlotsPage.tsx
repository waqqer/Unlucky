import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer from "@/widgets/Games/Layout/GameContainer"

const SlotsPage = () => {
    return (
        <Page>
            <ParticleBackground />

            <Section justify="center" align="center">
                <GameContainer type="double"/>
            </Section>
        </Page>
    )
}

export default memo(SlotsPage)