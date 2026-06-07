import { Miner, Rocket, Slots } from "../Assets/Images"

export interface GameInfo {
    title: string,
    desc?: string,
    route: string,
    icon: string
}

const GamesConfig: GameInfo[] = [
    {
        title: "Слоты",
        desc: "Выбей ряд одинаковых предметов и получай ИКСЫ!",
        route: "/slots",
        icon: Slots
    },
    {
        title: "Майнер",
        desc: "От твоей удачи зависит кирка, которая поможет добраться до лута!",
        route: "/miner",
        icon: Miner
    },
    {
        title: "Мины",
        route: "/bombs",
        icon: Rocket
    }
]

export default GamesConfig