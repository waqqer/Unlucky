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
            glow: true
        },

        "epic": {
            texture: Miner.Chests.EpicChest,
            opened_texture: Miner.Chests.EpicChest_Open,
            color: "#5DF0E9",

            sound: {
                opening: MinerSFX.Chests.Open
            },

            glow_texture: Miner.Glow,
            glow: true
        }
    }
}

export default Config