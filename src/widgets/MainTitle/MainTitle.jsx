import Title from "@/components/Title"
import { memo } from "react"
import Container from "@/components/Container"
import styles from "./MainTitle.module.css"

const MainTitle = () => {
    return (
        <Container className={styles["title-box"]}>
            <Title className={styles["main-title"]}>
                <h1 className={styles.title}>
                    <span>Un</span>
                    <span className={styles["purple-part"]}>lucky</span>
                </h1>
                <p className={styles.desc}>
                    Онлайн казино на сервере СПм для поддержки казны и спонсирования Коробки..
                </p>
            </Title>
        </Container>
    )
}

export default memo(MainTitle)