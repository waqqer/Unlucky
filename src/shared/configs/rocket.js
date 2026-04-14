export const ROCKET_CONFIG = {
    START_MULTIPLIER: 0.7,
    MULTIPLIER_SPEED: 0.25,
    MULTIPLIER_PRECISION: 100,

    MIN_BET: 1,
    MAX_BET: 100,
    BET_PRESETS: [1, 5, 10, 50, 100],

    SOUND: {
        FREQ_START: 440,
        FREQ_CASH_OUT: [523, 659, 784],
        FREQ_CRASH: 150,
        FREQ_TICK: 800,
        DURATION_START: 0.2,
        DURATION_CASH_OUT: [0.1, 0.1, 0.2],
        DURATION_CRASH: 0.4,
        DURATION_TICK: 0.05,
        GAIN: 0.1,
        GAIN_DECAY: 0.01
    }
}
