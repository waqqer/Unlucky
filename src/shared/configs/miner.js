import STONE_BLOCK from "@/shared/images/games/miner/blocks/stone.webp"
import IRON_BLOCK from "@/shared/images/games/miner/blocks/iron_block.webp"
import OBSIDIAN_BLOCK from "@/shared/images/games/miner/blocks/obsidian.webp"

import WOODEN_PICKAXE from "@/shared/images/games/miner/pickaxes/wooden_pickaxe.webp"
import IRON_PICKAXE from "@/shared/images/games/miner/pickaxes/iron_pickaxe.webp"
import DUAMOND_PICKAXE from "@/shared/images/games/miner/pickaxes/diamond_pickaxe.webp"

import CHEST_OPEN from "@/shared/audio/miner/chests/open.mp3"

import PICKAXE_BREAK from "@/shared/audio/miner/pickaxes/break.mp3"

import BLOCK_HIT from "@/shared/audio/miner/blocks/hit.mp3"
import BLOCK_BREAK_NORMAL from "@/shared/audio/miner/blocks/break_normal.mp3"
import BLOCK_BREAK_POOR from "@/shared/audio/miner/blocks/break_poor.mp3"
import BLOCK_BREAK_RICH from "@/shared/audio/miner/blocks/break_rich.mp3"

export const MINER_CONFIG = {
    MINER_MIN_BET: 10,
    MINER_MAX_BET: 1000,
    MINER_BET_PRESETS: [1, 5, 10, 50, 100],

    ROWS: 5,
    COLS: 5, 

    BLOCKS: {
        "stone": {
            TEXTURE: STONE_BLOCK,

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_POOR,

            HEALTH: 4
        },

        "iron": {
            TEXTURE: IRON_BLOCK,

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_NORMAL,

            HEALTH: 10
        },

        "obsidian": {
            TEXTURE: OBSIDIAN_BLOCK,

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_RICH,

            HEALTH: 20
        }
    },

    PICKAXES: {
        "wooden": {
            TEXTURE: WOODEN_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 5
        },

        "iron": {
            TEXTURE: IRON_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 10
        },

        "diamond": {
            TEXTURE: DUAMOND_PICKAXE,

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 15
        }
    },

    CHESTS: {
        "common": {
            TEXTURE: "",
            OPEN_TEXTURE: "",

            OPEN_SOUND: CHEST_OPEN
        },

        "uncommon": {
            TEXTURE: "",
            OPEN_TEXTURE: "",

            OPEN_SOUND: CHEST_OPEN
        },

        "rare": {
            TEXTURE: "",
            OPEN_TEXTURE: "",

            OPEN_SOUND: CHEST_OPEN
        },

        "epic": {
            TEXTURE: "",
            OPEN_TEXTURE: "",

            OPEN_SOUND: CHEST_OPEN
        }
    }
}
