import {
    Lucky, 
    Lucky2,
    Miner,
    Slots,
    Rocket,
    Rich,
    Tester,
    Winner,
    Null
} from "@/Shared/Assets/Images/Badges"

interface BadgesConfig {
    badges: Record<string, Badge>
    colors: Record<BadgeQuality, string>
    nullBadge: Badge
}

export interface Badge {
    title: string,
    description: string,
    icon: string,
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

        "rocket": {
            title: "К звёздам!",
            description: "Выдаётся за первую игру в `Ракета`",
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

        /*"marathon": {
            title: "Марафон",
            description: "Сыграть 100 или более игр",
            icon: Null,
            quality: "GOOD"
        },

        "loser": {
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
    },

    nullBadge: {
        title: "Неизвестно...",
        description: "Неизвестное достижение из другой вселенной",
        icon: Null,
        quality: "BASIC"
    }
}

export default BadgesConfig