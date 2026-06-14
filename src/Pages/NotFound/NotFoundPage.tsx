import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import LinkedButton from "@/Components/Controlls/Buttons/LinkedButton"
import styles from "./NotFoundPage.module.css"

const NotFoundPage = () => {
    return (
        <Page>
            <ParticleBackground />

            <Section justify="center">
                <div className={styles.content}>
                    <h1 className={styles.error}>404</h1>
                    <h1 className={styles.title}>Такой страницы не существует.</h1>
                    <p className={styles.desc}>Где-то здесь должна была быть крутая страница, но… мы её потеряли</p>
                    <LinkedButton to="/">
                        На главную
                    </LinkedButton>
                </div>
            </Section>
        </Page>
    )
}

export default memo(NotFoundPage)