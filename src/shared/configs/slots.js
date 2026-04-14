export const SLOTS_CONFIG = {
    REEL_COUNT: 3,
    MAX_SPINS: 20,
    SPIN_INTERVAL_MS: 100,
    REEL_STOP_DELAYS: [0, 8, 15],

    MIN_BET: 1,
    MAX_BET: 10000,
    BET_PRESETS: [1, 5, 10, 50, 500],

    AUTO_REROLL_DELAY_MS: 500,

    AUDIO_PLAYBACK_RATE: 1.2,

    SYMBOLS: ["star", "amethyst", "redstone", "coal", "iron", "gold", "diamond"],

    INITIAL_REELS: ["coal", "coal", "coal"],
    INITIAL_STOPPED: [false, false, false]
}
