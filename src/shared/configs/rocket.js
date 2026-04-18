import Particle1 from "@/shared/images/games/rocket/particle.webp"
import Particle2 from "@/shared/images/games/rocket/particle2.webp"
import Particle3 from "@/shared/images/games/rocket/particle3.webp"
import Particle4 from "@/shared/images/games/rocket/lava.webp"

export const ROCKET_CONFIG = {
    START_MULTIPLIER: 0.7,
    MULTIPLIER_SPEED: 0.25,
    MULTIPLIER_PRECISION: 100,

    MIN_BET: 1,
    MAX_BET: 100,
    BET_PRESETS: [1, 5, 10, 50, 100],

    VISUAL: {
        GRAPH: {
            START_PADDING: 40,
            ROCKET_SIZE: 64,
            ROCKET_ANGLE_OFFSET: 45
        },
        SMOKE: {
            ENABLED: true,
            SPRITES: [Particle1, Particle2, Particle3],
            PARTICLE_COUNT: 14,
            BASE_SIZE: 16,
            ALPHA: 0.7,
            SPACING: 14,
            SPEED: 80,
            BASE_BACK: 10,
            MAX_BACK: 220,
            SIDE_SPREAD: 10,
            DRIFT: 15,
            ROTATION_SPEED: 1.2,
            ENGINE_OFFSET_X: -6,
            ENGINE_OFFSET_Y: 14,
            DIRECTION_ANGLE_OFFSET: -65
        },

        EXPLOSION: {
            ENABLED: true,
            DURATION_MS: 700,
            SPRITES: [Particle1, Particle2, Particle3, Particle4],
            PARTICLE_COUNT: 32,
            BASE_SIZE: 18,
            ALPHA: 0.9,
            SPEED: 260,
            SPREAD: 25,
            ROTATION_SPEED: 1
        }
    },

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
