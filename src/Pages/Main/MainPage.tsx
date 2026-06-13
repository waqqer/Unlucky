import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Page from "../Page"
import { memo } from "react"
import Button from "@/Components/Controlls/Buttons/Button"
import styles from "./Main.module.css"
import Separator from "@/Components/Decorations/Separator/Separator"

const MainPage = () => {
    return (
        <Page className={styles.box}>
            <ParticleBackground />

            <Button type="PRIMARY">
                Click me
            </Button>
            
            <Separator />
            
            <Button type="SECONDARY">
                Click me
            </Button>
        </Page>
    )
}

export default memo(MainPage)