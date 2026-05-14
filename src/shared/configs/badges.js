import NULL_BADGE from "@/shared/images/badges/null_badge.webp"

import MINER_BADGE from "@/shared/images/badges/miner_badge.webp"
import ROCKET_BADGE from "@/shared/images/badges/rocket_badge.webp"
import SLOTS_BADGE from "@/shared/images/badges/slots_badge.webp"
import WINNER_BADGE from "@/shared/images/badges/winner_badge.webp"
import RICH_BADGE from "@/shared/images/badges/rich_badge.webp"
import LUCKY_BADGE from "@/shared/images/badges/lucky_badge.webp"
import LUCKY2_BADGE from "@/shared/images/badges/lucky2_badge.webp"
import TESTER_BADGE from "@/shared/images/badges/tester_badge.webp"

export const BADGES_CONFIG = {
    badges: {
        "slots": {
            title: "Азарт",
            descripton: "Даётся за первую игру в `Слоты`",
            icon: SLOTS_BADGE,
            quality: "BASIC"
        },

        "miner": {
            title: "Рудокоп",
            descripton: "Даётся за первую игру в `Майнер`",
            icon: MINER_BADGE,
            quality: "BASIC"
        },

        "rocket": {
            title: "К звёздам!",
            descripton: "Даётся за первую игру в `Ракета`",
            icon: ROCKET_BADGE,
            quality: "BASIC"
        },

        "winner": {
            title: "Победитель",
            descripton: "Даётся за первую победу в любой из игр",
            icon: WINNER_BADGE,
            quality: "GOOD"
        },

        "lucky": {
            title: "Везунчик",
            descripton: "Капуцк, ты везунчик! Целых 5 побед подряд...",
            icon: LUCKY_BADGE,
            quality: "EPIC"
        },

        "lucky2": {
            title: "Везунчик II",
            descripton: "10 Побед подряд... Как так?",
            icon: LUCKY2_BADGE,
            quality: "LEGENDARY"
        },

        "rich": {
            title: "Богач",
            descripton: "Даётся за выйгрышь больше 1000 ар.",
            icon: RICH_BADGE,
            quality: "LEGENDARY"
        },

        "marathon": {
            title: "Задрот",
            descripton: "Сыграй 100 или более игр",
            icon: null,
            quality: "GOOD"
        },

        "loser": {
            title: "Лузер",
            descripton: "Проиграй 5 или более игр",
            icon: null,
            quality: "GOOD"
        },

        "tester": {
            title: "Бета-тестер",
            descripton: "Даётся за участие в бета-тесте Unlucky",
            icon: TESTER_BADGE,
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

    null_badge_icon: NULL_BADGE
}