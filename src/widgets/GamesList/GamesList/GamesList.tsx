import { GamesConfig } from "@/Shared/Configs"
import { memo } from "react"
import GameCard from "../GameCard"
import styles from "./GamesList.module.css"

const GamesList = () => {
    return (
        <div className={styles.list}>
            {GamesConfig.map((v, i) => (
                <GameCard game={v} key={i} />
            ))}
        </div>
    )
}

export default memo(GamesList)