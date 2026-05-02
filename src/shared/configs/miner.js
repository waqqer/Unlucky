import STONE_BLOCK from "@/shared/images/games/miner/blocks/stone.webp"
import IRON_BLOCK from "@/shared/images/games/miner/blocks/iron_block.webp"
import OBSIDIAN_BLOCK from "@/shared/images/games/miner/blocks/obsidian.webp"

import WOODEN_PICKAXE from "@/shared/images/games/miner/pickaxes/wooden_pickaxe.webp"
import IRON_PICKAXE from "@/shared/images/games/miner/pickaxes/iron_pickaxe.webp"
import DUAMOND_PICKAXE from "@/shared/images/games/miner/pickaxes/diamond_pickaxe.webp"

export const MINER_CONFIG = {
    MINER_MIN_BET: 10,
    MINER_MAX_BET: 1000,
    MINER_BET_PRESETS: [1, 5, 10, 50, 100],

    ROWS: 5,
    COLS: 5, 

    BLOCKS: {
        "stone": {
            TEXTURE: STONE_BLOCK,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 4
        },

        "iron": {
            TEXTURE: IRON_BLOCK,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 10
        },

        "obsidian": {
            TEXTURE: OBSIDIAN_BLOCK,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 20
        }
    },

    PICKAXES: {
        "wooden": {
            TEXTURE: WOODEN_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 5
        },

        "iron": {
            TEXTURE: IRON_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 10
        },

        "diamond": {
            TEXTURE: DUAMOND_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 15
        }
    },

    CHESTS: {
        "common": {
            TEXTURE: "",

            OPEN_TEXTURE: "",
            OPEN_SOUND: ""
        },

        "uncommon": {
            TEXTURE: "",

            OPEN_TEXTURE: "",
            OPEN_SOUND: ""
        },

        "rare": {
            TEXTURE: "",

            OPEN_TEXTURE: "",
            OPEN_SOUND: ""
        },

        "epic": {
            TEXTURE: "",
            
            OPEN_TEXTURE: "",
            OPEN_SOUND: ""
        }
    }
}
