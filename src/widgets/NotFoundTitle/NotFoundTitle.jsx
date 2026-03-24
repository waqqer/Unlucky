import Title from "@/components/Title"
import LinkButton from "@/components/LinkButton"
import UserProfile from "@/widgets/UserProfile"
import styles from "./NotFoundTitle.module.css"

const NotFoundTitle = () => {
    return (
        <>
            <header>
                <UserProfile />
            </header>

            <main>
                <Title className={styles["not-found-title"]}>
                    <i className={`fa-solid fa-circle-exclamation ${styles["error-icon"]}`}></i>
                    <h1 className="title">Упс! Кажется, здесь кто-то всё сломал...</h1>
                    <p className="desc">Страница, которую вы ищете, либо удалена, либо никогда не существовала!</p>

                    <LinkButton className={styles["not-found-btn"]}>На главную</LinkButton>
                </Title>
            </main>
        </>
    )
}

export default NotFoundTitle