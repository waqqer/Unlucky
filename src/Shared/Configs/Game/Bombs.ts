import * as Bombs from "@/Shared/Assets/Games/Bombs"
import * as BombsSFX from "@/Shared/Assets/Audio/Bombs"

type Tile = {
    texture: string
    multiplier?: number
    sound: {
        open: string
    }
}

interface BombsConfig {
    GRID_X_SIZE: number
    GRID_Y_SIZE: number

    EXPLODE_PARTICLE: string
    EXPLODE_PARTICLES_COUNT: number
    EXPLODE_PARTICLES_MIN_DISTANCE: number
    EXPLODE_PARTICLES_MAX_DISTANCE: number
    EXPLODE_PARTICLES_DURATION_MS: number
    EXPLODE_PARTICLES_MAX_DELAY_MS: number
    EXPLODE_REVEAL_DELAY_MS: number
    CLOSED_TILE_TEXTURE: string

    GOOD_TILES: Record<string, Tile>
    BAD_TILES: Record<string, Tile>
    DEFAULT_TILE: Record<string, Tile>
}

const Config: BombsConfig = {
    GRID_X_SIZE: 5,
    GRID_Y_SIZE: 5,

    EXPLODE_PARTICLE: Bombs.ExplodeParticle,
    EXPLODE_PARTICLES_COUNT: 24,
    EXPLODE_PARTICLES_MIN_DISTANCE: 56,
    EXPLODE_PARTICLES_MAX_DISTANCE: 104,
    EXPLODE_PARTICLES_DURATION_MS: 560,
    EXPLODE_PARTICLES_MAX_DELAY_MS: 40,
    EXPLODE_REVEAL_DELAY_MS: 220,
    CLOSED_TILE_TEXTURE: Bombs.Default.Hidden,

    GOOD_TILES: {
        "iron": {
            texture: Bombs.Good.Iron,
            multiplier: 0.25,
            sound: {
                open: BombsSFX.GoodOpen
            }
        },
        "gold": {
            texture: Bombs.Good.Gold,
            multiplier: 0.5,
            sound: {
                open: BombsSFX.GoodOpen
            }
        },
        "diamond": {
            texture: Bombs.Good.Diamond,
            multiplier: 1,
            sound: {
                open: BombsSFX.GoodOpen
            }
        }
    },

    BAD_TILES: {
        "tnt": {
            texture: Bombs.Bad.Tnt,
            sound: {
                open: BombsSFX.Explode
            }
        }
    },

    DEFAULT_TILE: {
        "empty": {
            texture: Bombs.Default.Hidden,
            sound: {
                open: BombsSFX.DefaultOpen
            }
        }
    }
}

export default Config
