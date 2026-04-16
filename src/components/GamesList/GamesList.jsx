import GameCard from "../GameCard"
import { memo } from "react"
import { GAMES_CONFIG } from "@/shared/configs"
import styles from "./GamesList.module.css"

const games = GAMES_CONFIG

const GamesList = () => {
    
    return (
        <div className={styles["games-list"]}>
            {games.map(e =>
                <GameCard 
                    key={e.key}
                    title={e.title}
                    desc={e.desc}
                    image={e.img}
                    link={e.url}
                    enable={e.enable ?? true}
                />
            )}
        </div>
    )
}

export default memo(GamesList)