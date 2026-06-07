import { memo } from "react"
import styles from "./GamesList.module.css"
import { GamesConfig } from "@/Shared/Configs"
import GameCard from "@/Components/Games/GameCard"

const GamesList = () => {
    return (
        <div className={styles.games}>
            {GamesConfig.map((v, i) => (
                <GameCard
                    key={i}
                    gameData={v}
                />
            ))}
        </div>
    )
}

export default memo(GamesList)