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
            description: "Выдаётся за первую игру в `Слоты`",
            icon: SLOTS_BADGE,
            quality: "BASIC"
        },

        "miner": {
            title: "Рудокоп",
            description: "Выдаётся за первую игру в `Майнер`",
            icon: MINER_BADGE,
            quality: "BASIC"
        },

        "rocket": {
            title: "К звёздам!",
            description: "Выдаётся за первую игру в `Ракета`",
            icon: ROCKET_BADGE,
            quality: "BASIC"
        },

        "winner": {
            title: "Победитель",
            description: "Выдаётся за первую победу в любой игре",
            icon: WINNER_BADGE,
            quality: "GOOD"
        },

        "lucky": {
            title: "Везунчик",
            description: "Одержать 5 побед подряд",
            icon: LUCKY_BADGE,
            quality: "EPIC"
        },

        "lucky2": {
            title: "Абсолютный везунчик",
            description: "Одержать 10 побед подряд",
            icon: LUCKY2_BADGE,
            quality: "LEGENDARY"
        },

        "rich": {
            title: "Богач",
            description: "Выиграть 1000 AR или больше за одну игру",
            icon: RICH_BADGE,
            quality: "LEGENDARY"
        },

        /*"marathon": {
            title: "Марафон",
            description: "Сыграть 100 или более игр",
            icon: NULL_BADGE,
            quality: "GOOD"
        },

        "loser": {
            title: "Неудачник",
            description: "Проиграть 5 или более игр",
            icon: NULL_BADGE,
            quality: "GOOD"
        },*/

        "tester": {
            title: "Бета-тестер",
            description: "Выдаётся за участие в бета-тесте Unlucky",
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