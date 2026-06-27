interface SlotsConfig {
    REEL_WIDTH: number
    REEL_HEIGHT: number
    REEL_COUNT: number

    SYMBOLS: string[]

    MAX_BET: number
    MIN_BET: number
}

const Config: SlotsConfig = {
    REEL_COUNT: 3,
    REEL_HEIGHT: 130,
    REEL_WIDTH: 130,

    SYMBOLS: [
        "coal",
        "iron",
        "diamond"
    ],

    MAX_BET: 1000,
    MIN_BET: 10
}

export default Config