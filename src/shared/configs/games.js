import SlotsImage from "@/shared/images/slots.webp"
import MinerImage from "@/shared/images/miner.webp"
import RocketImage from "@/shared/images/rocket.webp"

export const GAMES_CONFIG = [
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
        enable: true
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