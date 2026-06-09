import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import Logo from "@/Components/Brand/Logo"
import SectionTitle from "@/Components/Decorations/SectionTitle/SectionTitle"
import { Randomizer } from "@/Shared/Utils"
import { PagesConfig } from "@/Shared/Configs"
import Section from "@/Components/Containers/Section"
import GamesList from "@/Components/Containers/GamesList"

const MainPage = () => {
    return (
        <Page>
            <ParticleBackground />
            
            <Section>
                <Logo width={500} background />
                <SectionTitle text={Randomizer.getRandomEl(PagesConfig.MainPage_title)} />
                <GamesList />
            </Section>

            <Section>
                <SectionTitle text={"Рейтинг"} animate={false} />
            </Section>
        </Page>
    )
}

export default memo(MainPage)