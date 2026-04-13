import GameCard from "../GameCard"
import SlotsImage from "@/shared/images/slots.png"
import MinerImage from "@/shared/images/miner.png"
import RocketImage from "@/shared/images/rocket.png"
import { memo } from "react"
import styles from "./GamesList.module.css"

const games = [
    {
        key: 1,
        title: "Слоты",
        desc: "Выбей ряд одинаковых предметов и получай ИКСЫ!",
        img: SlotsImage,
        url: "/slots",
        enable: true
    },

    {
        key: 2,
        title: "Майнер",
        desc: "От твоей удачи зависит кирка, которая поможет добраться до лута!",
        img: MinerImage,
        url: "/miner",
        enable: false
    },

    {
        key: 3,
        title: "Ракета",
        desc: "Ракета набирает высоту, а с ней растёт твой выигрыш. Успей остановиться!",
        img: RocketImage,
        url: "/rocket",
        enable: true
    }
]

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