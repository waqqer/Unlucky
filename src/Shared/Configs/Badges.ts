import {
    Lucky, 
    Lucky2,
    Marathon,
    Miner,
    Slots,
    Rocket,
    Rich,
    Tester,
    Winner
} from "@/Shared/Assets/Images/Badges"

interface BadgesConfig {
    badges: Record<string, Badge>
    colors: Record<BadgeQuality, string>
}

export interface Badge {
    title: string
    description: string
    icon: string
    quality: BadgeQuality
}

type BadgeQuality = "BASIC" | "GOOD" | "EPIC" | "LEGENDARY" | "LIMITED"

const BadgesConfig: BadgesConfig = {
    badges: {
        "slots": {
            title: "Азарт",
            description: "Выдаётся за первую игру в `Слоты`",
            icon: Slots,
            quality: "BASIC"
        },

        "miner": {
            title: "Рудокоп",
            description: "Выдаётся за первую игру в `Майнер`",
            icon: Miner,
            quality: "BASIC"
        },

        "bombs": {
            title: "БУУМ!!!",
            description: "Выдаётся за первую игру в `Мины`",
            icon: Rocket,
            quality: "BASIC"
        },

        "winner": {
            title: "Победитель",
            description: "Выдаётся за первую победу в любой игре",
            icon: Winner,
            quality: "GOOD"
        },

        "lucky": {
            title: "Везунчик",
            description: "Одержать 5 побед подряд",
            icon: Lucky,
            quality: "EPIC"
        },

        "lucky2": {
            title: "Абсолютный везунчик",
            description: "Одержать 10 побед подряд",
            icon: Lucky2,
            quality: "LEGENDARY"
        },

        "rich": {
            title: "Богач",
            description: "Выиграть 1000 AR или больше за одну игру",
            icon: Rich,
            quality: "LEGENDARY"
        },

        "marathon": {
            title: "Марафон",
            description: "Выдаётся за без прерывную игру в UnLucky",
            icon: Marathon,
            quality: "GOOD"
        },

        /*"loser": {
            title: "Неудачник",
            description: "Проиграть 5 или более игр",
            icon: Null,
            quality: "GOOD"
        },*/

        "tester": {
            title: "Бета-тестер",
            description: "Выдаётся за участие в бета-тесте Unlucky",
            icon: Tester,
            quality: "LIMITED"
        },
    },

    colors: {
        "BASIC": '#677751',
        "GOOD": '#57b0c0',
        "EPIC": '#df46d2',
        "LEGENDARY": '#ffa048',
        "LIMITED": '#eb3a3a',
    }
} as const

export default BadgesConfig
