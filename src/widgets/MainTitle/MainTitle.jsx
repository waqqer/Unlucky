import Title from "@/components/Title"
import { memo } from "react"
import Container from "@/components/Container"
import Icon from "@/shared/images/games/slots/star.webp"
import styles from "./MainTitle.module.css"

const MainTitle = () => {
    return (
        <Container className={styles["title-box"]}>
            <Title className={styles["main-title"]}>
                <div className={styles["title-container"]}>
                    <img src={Icon} alt="Unlucky icon" width={96} height={96} />
                    <h1 className={styles.title}>
                        <span>Un</span>
                        <span className={styles["purple-part"]}>lucky</span>
                    </h1>
                </div>
                <p className={styles.desc}>
                    Онлайн казино на сервере СПм для поддержки казны и спонсирования Коробки..
                </p>
            </Title>
        </Container>
    )
}

export default memo(MainTitle)