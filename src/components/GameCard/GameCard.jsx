import LinkButton from "@/components/LinkButton"
import styles from "./GameCard.module.css"

const GameCard = (props) => {
    const {
        link,
        title,
        desc,
        image
    } = props

    return (
        <div style={{backgroundImage: `url(${image})`}} className={styles["game-card"]}>
            <div className={styles.details}>
                <h3 className="title">{title}</h3>

                <div className={styles["game-desc"]}>
                    <p className={`desc ${styles.desc}`}>{desc}</p>
                    <LinkButton className={styles["play-game-button"]} to={link}> Играть </LinkButton>
                </div>
            </div>
        </div>
    )
}

export default GameCard