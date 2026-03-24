import Title from "@/components/Title"
import styles from "./MainTitle.module.css"

const MainTitle = () => {
    return (
        <section className="container">
            <Title className={styles["main-title"]}>
                <h1 className={`title ${styles.title}`}>
                    <span>Un</span>
                    <span className={styles["purple-part"]}>lucky</span>
                </h1>
                <p className="desc">
                    Онлайн казино на сервере СПм для поддержки казны и спонсирования Коробки..
                </p>
            </Title>
        </section>
    )
}

export default MainTitle