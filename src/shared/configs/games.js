import { Slots, Rocket, Miner } from "@/shared/images"

export const GAMES_CONFIG = [
    {
        title: "Слоты",
        desc: "Выбей ряд одинаковых предметов и получай ИКСЫ!",
        img: Slots,
        url: "/slots",
        enable: true
    },

    {
        title: "Майнер",
        desc: "От твоей удачи зависит кирка, которая поможет добраться до лута!",
        img: Miner,
        url: "/miner",
        enable: true
    },

    {
        title: "Ракета",
        desc: "Ракета набирает высоту, а с ней растёт твой выигрыш. Успей остановиться!",
        img: Rocket,
        url: "/rocket",
        enable: true
    }
]