import { memo, useCallback } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import { useNavigate } from "react-router"
import Button from "@/Components/Controlls/Buttons/Button"
import styles from "./NotFoundPage.module.css"

const NotFoundPage = () => {
    const nav = useNavigate()

    const handleClick = useCallback(() => {
        nav("/")
    }, [])
    
    return (
        <Page>
            <ParticleBackground />
            
            <Section className={styles.content}>
                <h1 className={styles.title}>404. Такой страницы не существует.</h1>
                <p className={styles.desc}>Где-то здесь должна была быть крутая страница, но… мы её потеряли</p>
                <Button className={styles.btn} onClick={handleClick} type="primary">На главную</Button>
            </Section>
        </Page>
    )
}

export default memo(NotFoundPage)