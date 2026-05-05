import Title from "@/components/Title"
import { memo } from "react"
import Container from "@/components/Container"
import Logo from "@/shared/images/logo.webp"
import styles from "./MainTitle.module.css"

const MainTitle = () => {
    return (
        <Container className={styles["title-box"]}>
            <Title className={styles["main-title"]}>
                <div className={styles["title-container"]}>
                    <img
                        className={styles.logo}
                        src={Logo}
                        alt="Unlucky logo"
                        draggable={false}
                        loading="eagle"
                        width={1000}
                    />
                </div>
            </Title>
        </Container>
    )
}

export default memo(MainTitle)