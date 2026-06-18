import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import styles from "./Main.module.css"
import Section from "@/Components/Containers/Section"
import Separator from "@/Components/Decorations/Separator"
import Logo from "@/Components/Brand/Logo"
import SectionTitle from "@/Components/Decorations/SectionTitle"
import { PagesConfig } from "@/Shared/Configs"
import GamesList from "@/widgets/GamesList/GamesList"
import LeaderboardBox from "@/widgets/Leaderboard/LeaderboardBox"
import { randomElement } from "@/Shared/Utils/Randomizer"

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

            <Section justify="space-between" className="hide--mobile">
                <SectionTitle text="Главные лудоманы" className={styles["leader-title"]} />

                <LeaderboardBox />
            </Section>
        </Page>
    )
}

export default memo(MainPage)