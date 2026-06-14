import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import styles from "./Main.module.css"
import Section from "@/Components/Containers/Section"
import Separator from "@/Components/Decorations/Separator/Separator"
import Logo from "@/Components/Brand/Logo/Logo"
import SectionTitle from "@/Components/Decorations/SectionTitle/SectionTitle"
import { randomElement } from "blaze-engine"
import { PagesConfig } from "@/Shared/Configs"
import GamesList from "@/widgets/GamesList/GamesList"

const MainPage = () => {
    return (
        <Page className={styles.box}>
            <ParticleBackground />

            <Section justify="start">
                <Logo size={452} />
                <SectionTitle text={randomElement(PagesConfig.MainPage_title)} animate/>
                <Separator size={50} className="hide--tablet"/>
                <GamesList />
            </Section>

            <Section>
                <SectionTitle text="Фонды" />
            </Section>

            <Section className="hide--mobile">
                <SectionTitle text="Рейтинг" />
            </Section>
        </Page>
    )
}

export default memo(MainPage)