import LinkButton from "@/components/LinkButton"
import { memo } from "react"
import styles from "./GameCard.module.css"

const GameCard = (props) => {
    const {
        link,
        title,
        desc,
        image
    } = props

    const bg_style = {
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%"
    }

    return (
        <div style={bg_style} className={styles["game-card"]}>
            <div className={styles.details}>
                <h3 className={styles.title}>{title}</h3>

                <div className={styles["game-desc"]}>
                    <p className={styles.desc}>{desc}</p>
                    <LinkButton className={styles["play-game-button"]} to={link}> Играть </LinkButton>
                </div>
            </div>
        </div>
    )
}

export default memo(GameCard)