import Title from "@/components/Title"
import LinkButton from "@/components/LinkButton"
import UserProfile from "@/widgets/UserProfile"
import styles from "./NotFoundTitle.module.css"
import Container from "../../components/Container"

const NotFoundTitle = () => {
    return (
        <>
            <header>
                <UserProfile />
            </header>

            <main>
                <Container className={styles["not-found-box"]}>
                    <Title className={styles["not-found-title"]}>
                        <i className={`fa-solid fa-circle-exclamation ${styles["error-icon"]}`}></i>
                        <h1 className={styles.title}>Упс! Кажется, здесь кто-то всё сломал...</h1>
                        <p className={styles.desc}>Страница, которую вы ищете, либо удалена, либо никогда не существовала!</p>
                    </Title>
                    <LinkButton className={styles.btn}>На главную</LinkButton>
                </Container>
            </main>
        </>
    )
}

export default NotFoundTitle