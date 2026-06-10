import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import Logo from "@/Components/Brand/Logo"
import SectionTitle from "@/Components/Decorations/SectionTitle/SectionTitle"
import { Randomizer } from "@/Shared/Utils"
import { PagesConfig } from "@/Shared/Configs"
import Section from "@/Components/Containers/Section"
import GamesList from "@/Components/Containers/GamesList"
import styles from "./Main.module.css"
import LeaderboardList from "@/Components/Containers/LeaderboardList"

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
                <SectionTitle text={"Фонды"} animate={false} />
            </Section>

            <Section>
                <SectionTitle text={"Рейтинг"} animate={false} />

                <div className={styles.leaders}>
                    <LeaderboardList data={[1, 3, 4]} title="По кол-ву побед"/>
                    <LeaderboardList data={[1, 3, 4]} title="По кол-ву игр"/>
                    <LeaderboardList data={[1, 3, 4, 1, 3, 4, 1, 3, 4]} title="По балансу"/>
                </div>
            </Section>
        </Page>
    )
}

export default memo(MainPage)