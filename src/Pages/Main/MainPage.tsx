import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import { Randomizer } from "@/Shared/Utils"
import { PagesConfig } from "@/Shared/Configs"
import styles from "./Main.module.css"

const MainPage = () => {
    return (
        <Page>
            <ParticleBackground />
            
            
        </Page>
    )
}

export default memo(MainPage)