import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo, useContext } from "react"
import styles from "./Main.module.css"
import Section from "@/Components/Containers/Section"
import Separator from "@/Components/Decorations/Separator"
import Logo from "@/Components/Brand/Logo"
import SectionTitle from "@/Components/Decorations/SectionTitle"
import { PagesConfig } from "@/Shared/Configs"
import { useRef } from "react"
import GamesList from "@/widgets/GamesList/GamesList"
import LeaderboardBox from "@/widgets/Leaderboard/LeaderboardBox"
import { randomElement } from "@/Shared/Utils/Randomizer"
import SectionPicker from "@/Components/Controlls/SectionPicker"

const MainPage = () => {
    const titleRef = useRef<string>(randomElement(PagesConfig.MainPage_title))

    return (
        <Page className={styles.box}>
            <ParticleBackground />

            <SectionPicker sections={[
                { name: "Главная", id: "main", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M304 70.1C313.1 61.9 326.9 61.9 336 70.1L568 278.1C577.9 286.9 578.7 302.1 569.8 312C560.9 321.9 545.8 322.7 535.9 313.8L527.9 306.6L527.9 511.9C527.9 547.2 499.2 575.9 463.9 575.9L175.9 575.9C140.6 575.9 111.9 547.2 111.9 511.9L111.9 306.6L103.9 313.8C94 322.6 78.9 321.8 70 312C61.1 302.2 62 287 71.8 278.1L304 70.1zM320 120.2L160 263.7L160 512C160 520.8 167.2 528 176 528L224 528L224 424C224 384.2 256.2 352 296 352L344 352C383.8 352 416 384.2 416 424L416 528L464 528C472.8 528 480 520.8 480 512L480 263.7L320 120.3zM272 528L368 528L368 424C368 410.7 357.3 400 344 400L296 400C282.7 400 272 410.7 272 424L272 528z"/>
                    </svg>
                )},
                { name: "Лидеры", id: "leaders", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M448 112C456.8 112 464 119.2 464 128L464 512C464 520.8 456.8 528 448 528L160 528C151.2 528 144 520.8 144 512L144 128C144 119.2 151.2 112 160 112L448 112zM160 64C124.7 64 96 92.7 96 128L96 512C96 547.3 124.7 576 160 576L448 576C483.3 576 512 547.3 512 512L512 128C512 92.7 483.3 64 448 64L160 64zM304 312C334.9 312 360 286.9 360 256C360 225.1 334.9 200 304 200C273.1 200 248 225.1 248 256C248 286.9 273.1 312 304 312zM272 352C227.8 352 192 387.8 192 432C192 440.8 199.2 448 208 448L400 448C408.8 448 416 440.8 416 432C416 387.8 380.2 352 336 352L272 352zM576 144C576 135.2 568.8 128 560 128C551.2 128 544 135.2 544 144L544 208C544 216.8 551.2 224 560 224C568.8 224 576 216.8 576 208L576 144zM560 256C551.2 256 544 263.2 544 272L544 336C544 344.8 551.2 352 560 352C568.8 352 576 344.8 576 336L576 272C576 263.2 568.8 256 560 256zM576 400C576 391.2 568.8 384 560 384C551.2 384 544 391.2 544 400L544 464C544 472.8 551.2 480 560 480C568.8 480 576 472.8 576 464L576 400z"/>
                    </svg>
                )}
            ]} />

            <Section justify="start" id="main">
                <Logo size={452} />
                <SectionTitle text={titleRef.current} animate/>
                <Separator size={50} className="hide--tablet"/>
                <GamesList />
            </Section>

            <Section justify="space-between" className="hide--mobile" id="leaders">
                <SectionTitle text="Главные лудоманы" className={styles["leader-title"]} />

                <LeaderboardBox />
            </Section>
        </Page>
    )
}

export default memo(MainPage)