import * as Bombs from "@/Shared/Assets/Games/Bombs"
import * as BombsSFX from "@/Shared/Assets/Audio/Bombs"

type Tile = {
    texture: string
    sound: {
        open: string
    }
}

interface BombsConfig {
    GRID_X_SIZE: number
    GRID_Y_SIZE: number

    GOOD_TILES: Record<string, Tile>
    BAD_TILES: Record<string, Tile>
    DEFAULT_TILE: Record<string, Tile>
}

const Config: BombsConfig = {
    GRID_X_SIZE: 5,
    GRID_Y_SIZE: 5,

    GOOD_TILES: {
        "iron": {
            texture: Bombs.Good.Iron,
            sound: {
                open: BombsSFX.GoodOpen
            }
        },
        "gold": {
            texture: Bombs.Good.Gold,
            sound: {
                open: BombsSFX.GoodOpen
            }
        },
        "diamond": {
            texture: Bombs.Good.Diamond,
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
