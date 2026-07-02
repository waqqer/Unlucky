import * as Miner from "@/Shared/Assets/Games/Miner"
import * as MinerSFX from "@/Shared/Assets/Audio/Miner"

type Block = {
    texture: string
    color: string

    sound: {
        hit: string,
        break: string
    }

    health: number
}

type Pickaxe = {
    texture: string
    color: string

    sound: {
        hit: string,
        break: string
    }

    health: number
}

type ChestGlowConfig = {
    spawnIntervalSec: number
    cellPaddingMult: number
    speedMin: number
    speedRandom: number
    lifeBaseSec: number
    lifeRandomSec: number
    sizeMinPx: number
    sizeRandomPx: number
    drag: number
    speedMultiplier: number
    distanceMultiplier: number
}

type Chest = {
    texture: string
    opened_texture: string
    color: string

    sound: {
        opening: string
    }

    glow_texture: string
    glow: boolean
    glow_config?: ChestGlowConfig
}

interface MinerConfig {
    ROWS: number
    COLS: number
    PICKAXES_ROWS: number

    CELL_SIZE_PX: number
    GRID_GAP_PX: number

    SLOT_TEXTURE: string
    BACKGROUND_TEXTURE: string
    BREAK_TEXTURE: string[]

    SOUND_VOLUME: number
    PICKAXE_FALL_DURATION_MS: number
    PICKAXE_FALL_SPINS: number
    PICKAXE_BOUNCE_DURATION_MS: number
    PICKAXE_ROW_PAUSE_MS: number
    PICKAXE_BETWEEN_HIT_DELAY_MS: number
    SLOT_SPIN_DURATION_MS: number
    SLOT_STOP_STAGGER_MS: number
    CHEST_OPEN_DURATION_MS: number
    CHEST_GLOW_DEFAULTS: ChestGlowConfig

    BLOCKS: Record<string, Block>
    PICKAXES: Record<string, Pickaxe>
    CHESTS: Record<string, Chest>
}

const Config: MinerConfig = {
    ROWS: 5,
    COLS: 5,
    PICKAXES_ROWS: 3,

    CELL_SIZE_PX: 64,
    GRID_GAP_PX: 6,

    SLOT_TEXTURE: Miner.Slot,
    BACKGROUND_TEXTURE: Miner.Background,
    BREAK_TEXTURE: [
        Miner.DestroyStage0,
        Miner.DestroyStage1,
        Miner.DestroyStage2,
        Miner.DestroyStage3,
        Miner.DestroyStage4,
        Miner.DestroyStage5,
        Miner.DestroyStage6,
        Miner.DestroyStage7,
        Miner.DestroyStage8,
        Miner.DestroyStage9
    ],

    SOUND_VOLUME: 0.18,
    PICKAXE_FALL_DURATION_MS: 410,
    PICKAXE_FALL_SPINS: 1,
    PICKAXE_BOUNCE_DURATION_MS: 480,
    PICKAXE_ROW_PAUSE_MS: 260,
    PICKAXE_BETWEEN_HIT_DELAY_MS: 25,
    SLOT_SPIN_DURATION_MS: 1150,
    SLOT_STOP_STAGGER_MS: 105,
    CHEST_OPEN_DURATION_MS: 460,
    CHEST_GLOW_DEFAULTS: {
        spawnIntervalSec: 0.065,
        cellPaddingMult: 0.1,
        speedMin: 28,
        speedRandom: 52,
        lifeBaseSec: 0.72,
        lifeRandomSec: 0.48,
        sizeMinPx: 7,
        sizeRandomPx: 11,
        drag: 0.987,
        speedMultiplier: 0.5,
        distanceMultiplier: 1.75
    },

    BLOCKS: {
        "stone": {
            texture: Miner.Blocks.Stone,
            color: "#7b7b7b",

            sound: {
                hit: MinerSFX.Blocks.Hit,
                break: MinerSFX.Blocks.BreakNormal
            },

            health: 5
        },

        "iron": {
            texture: Miner.Blocks.Iron,
            color: "#c7bdb1",

            sound: {
                hit: MinerSFX.Blocks.Hit,
                break: MinerSFX.Blocks.BreakNormal
            },

            health: 7
        },

        "grass": {
            texture: Miner.Blocks.Grass,
            color: "#457551",

            sound: {
                hit: MinerSFX.Blocks.HitDirt,
                break: MinerSFX.Blocks.BreakDirt
            },

            health: 2
        },

        "deepslate": {
            texture: Miner.Blocks.Deepslate,
            color: "#232325",

            sound: {
                hit: MinerSFX.Blocks.Hit,
                break: MinerSFX.Blocks.BreakRich
            },

            health: 15
        },

        "basalt": {
            texture: Miner.Blocks.Basalt,
            color: "#3d383d",

            sound: {
                hit: MinerSFX.Blocks.Hit,
                break: MinerSFX.Blocks.BreakPoor
            },

            health: 10
        },

        "obsidian": {
            texture: Miner.Blocks.Obsidian,
            color: "#3d383d",

            sound: {
                hit: MinerSFX.Blocks.Hit,
                break: MinerSFX.Blocks.BreakRich
            },

            health: 24
        }
    },

    PICKAXES: {
        "wooden": {
            texture: Miner.Pickaxes.Wooden,
            color: "#a0703b",

            sound: {
                hit: "",
                break: MinerSFX.Pickaxes.Break
            },

            health: 10
        },

        "iron": {
            texture: Miner.Pickaxes.Iron,
            color: "#d4d4d4",

            sound: {
                hit: "",
                break: MinerSFX.Pickaxes.Break
            },

            health: 15
        },

        "diamond": {
            texture: Miner.Pickaxes.Diamond,
            color: "#35d5e6",

            sound: {
                hit: "",
                break: MinerSFX.Pickaxes.Break
            },

            health: 25
        },

        "netherite": {
            texture: Miner.Pickaxes.Netherite,
            color: "#272323",

            sound: {
                hit: "",
                break: MinerSFX.Pickaxes.Break
            },

            health: 35
        }
    },

    CHESTS: {
        "common": {
            texture: Miner.Chests.Chest,
            opened_texture: Miner.Chests.Chest_Open,
            color: "#b87333",

            sound: {
                opening: MinerSFX.Chests.Open
            },

            glow_texture: Miner.Glow,
            glow: false
        },

        "uncommon": {
            texture: Miner.Chests.Chest,
            opened_texture: Miner.Chests.Chest_Open,
            color: "#3cb371",

            sound: {
                opening: MinerSFX.Chests.Open
            },

            glow_texture: Miner.Glow,
            glow: false
        },

        "rare": {
            texture: Miner.Chests.RareChest,
            opened_texture: Miner.Chests.RareChest_Open,
            color: "#FCB428",

            sound: {
                opening: MinerSFX.Chests.Open
            },

            glow_texture: Miner.Glow,
            glow: true,
            glow_config: {
                spawnIntervalSec: 0.05,
                cellPaddingMult: 0.12,
                speedMin: 20,
                speedRandom: 36,
                lifeBaseSec: 0.55,
                lifeRandomSec: 0.28,
                sizeMinPx: 7,
                sizeRandomPx: 10,
                drag: 0.95,
                speedMultiplier: 0.45,
                distanceMultiplier: 0.55
            }
        },

        "epic": {
            texture: Miner.Chests.EpicChest,
            opened_texture: Miner.Chests.EpicChest_Open,
            color: "#5DF0E9",

            sound: {
                opening: MinerSFX.Chests.Open
            },

            glow_texture: Miner.Glow,
            glow: true,
            glow_config: {
                spawnIntervalSec: 0.07,
                cellPaddingMult: 0.08,
                speedMin: 20,
                speedRandom: 50,
                lifeBaseSec: 0.5,
                lifeRandomSec: 0.3,
                sizeMinPx: 5,
                sizeRandomPx: 10,
                drag: 0.99,
                speedMultiplier: 0.35,
                distanceMultiplier: 2.2
            }
        }
    }
}

export default Config
