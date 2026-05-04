import STONE_BLOCK from "@/shared/images/games/miner/blocks/stone.webp"
import IRON_BLOCK from "@/shared/images/games/miner/blocks/iron.webp"
import OBSIDIAN_BLOCK from "@/shared/images/games/miner/blocks/obsidian.webp"
import GRASS_BLOCK from "@/shared/images/games/miner/blocks/grass.webp"
import BASALT_BLOCK from "@/shared/images/games/miner/blocks/basalt.webp"
import DEEPSLATE_BLOCK from "@/shared/images/games/miner/blocks/deepslate.webp"

import WOODEN_PICKAXE from "@/shared/images/games/miner/pickaxes/wooden_pickaxe.webp"
import IRON_PICKAXE from "@/shared/images/games/miner/pickaxes/iron_pickaxe.webp"
import DUAMOND_PICKAXE from "@/shared/images/games/miner/pickaxes/diamond_pickaxe.webp"

import SLOT_TEXTURE from "@/shared/images/games/miner/slot.webp"
import GLOW_TEXTURE from "@/shared/images/games/miner/glow.webp"

import CHEST_OPEN from "@/shared/audio/miner/chests/open.mp3"

import PICKAXE_BREAK from "@/shared/audio/miner/pickaxes/break.mp3"

import BLOCK_HIT from "@/shared/audio/miner/blocks/hit.mp3"
import BLOCK_HIT_DIRT from "@/shared/audio/miner/blocks/hit_dirt.mp3"
import BLOCK_BREAK_DIRT from "@/shared/audio/miner/blocks/break_dirt.mp3"
import BLOCK_BREAK_NORMAL from "@/shared/audio/miner/blocks/break_normal.mp3"
import BLOCK_BREAK_POOR from "@/shared/audio/miner/blocks/break_poor.mp3"
import BLOCK_BREAK_RICH from "@/shared/audio/miner/blocks/break_rich.mp3"

import BLOCK_BREAK_STAGE0 from "@/shared/images/games/miner/destroy_stage_0.png"
import BLOCK_BREAK_STAGE1 from "@/shared/images/games/miner/destroy_stage_1.png"
import BLOCK_BREAK_STAGE2 from "@/shared/images/games/miner/destroy_stage_2.png"
import BLOCK_BREAK_STAGE3 from "@/shared/images/games/miner/destroy_stage_3.png"
import BLOCK_BREAK_STAGE4 from "@/shared/images/games/miner/destroy_stage_4.png"
import BLOCK_BREAK_STAGE5 from "@/shared/images/games/miner/destroy_stage_5.png"
import BLOCK_BREAK_STAGE6 from "@/shared/images/games/miner/destroy_stage_6.png"
import BLOCK_BREAK_STAGE7 from "@/shared/images/games/miner/destroy_stage_7.png"
import BLOCK_BREAK_STAGE8 from "@/shared/images/games/miner/destroy_stage_8.png"
import BLOCK_BREAK_STAGE9 from "@/shared/images/games/miner/destroy_stage_9.png"

export const MINER_CONFIG = {
    MINER_MIN_BET: 10,
    MINER_MAX_BET: 1000,
    MINER_BET_PRESETS: [10, 25, 50, 100, 250],

    ROWS: 5,
    COLS: 5,
    PICKAXE_ROWS: 3,
    CELL_SIZE_PX: 64,
    GRID_GAP_PX: 6,

    PICKAXE_FALL_DURATION_MS: 410,
    PICKAXE_FALL_SPINS: 1,

    PICKAXE_BOUNCE_DURATION_MS: 480,
    PICKAXE_BOUNCE_HEIGHT_MULT: 1.4,

    SLOT_TEXTURE: SLOT_TEXTURE,
    BREAK_TEXTURES: [
        BLOCK_BREAK_STAGE0,
        BLOCK_BREAK_STAGE1,
        BLOCK_BREAK_STAGE2,
        BLOCK_BREAK_STAGE3,
        BLOCK_BREAK_STAGE4,
        BLOCK_BREAK_STAGE5,
        BLOCK_BREAK_STAGE6,
        BLOCK_BREAK_STAGE7,
        BLOCK_BREAK_STAGE8,
        BLOCK_BREAK_STAGE9
    ],

    BLOCKS: {
        "stone": {
            TEXTURE: STONE_BLOCK,
            COLOR: "#7b7b7b",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_POOR,

            HEALTH: 4
        },

        "iron": {
            TEXTURE: IRON_BLOCK,
            COLOR: "#c7bdb1",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_NORMAL,

            HEALTH: 7
        },

        "grass": {
            TEXTURE: GRASS_BLOCK,
            COLOR: "#457551",

            HIT_SOUND: BLOCK_HIT_DIRT,
            BREAK_SOUND: BLOCK_BREAK_DIRT,

            HEALTH: 2
        },

        "deepslate": {
            TEXTURE: DEEPSLATE_BLOCK,
            COLOR: "#232325",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_RICH,

            HEALTH: 11
        },

        "basalt": {
            TEXTURE: BASALT_BLOCK,
            COLOR: "#3d383d",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_POOR,

            HEALTH: 8
        },

        "obsidian": {
            TEXTURE: OBSIDIAN_BLOCK,
            COLOR: "#2b2233",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_RICH,

            HEALTH: 17
        }
    },

    PICKAXES: {
        "wooden": {
            TEXTURE: WOODEN_PICKAXE,
            COLOR: "#a0703b",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 7
        },

        "iron": {
            TEXTURE: IRON_PICKAXE,
            COLOR: "#d4d4d4",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 14
        },

        "diamond": {
            TEXTURE: DUAMOND_PICKAXE,
            COLOR: "#35d5e6",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 21
        }
    },

    CHESTS: {
        "common": {
            TEXTURE: null,
            OPEN_TEXTURE: null,
            COLOR: "#b87333",

            OPEN_SOUND: CHEST_OPEN,
            
            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        },

        "uncommon": {
            TEXTURE: null,
            OPEN_TEXTURE: null,
            COLOR: "#3cb371",

            OPEN_SOUND: CHEST_OPEN,
            
            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        },

        "rare": {
            TEXTURE: null,
            OPEN_TEXTURE: null,
            COLOR: "#4b7bec",

            OPEN_SOUND: CHEST_OPEN,
            
            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        },

        "epic": {
            TEXTURE: null,
            OPEN_TEXTURE: null,
            COLOR: "#9b59b6",

            OPEN_SOUND: CHEST_OPEN,
            
            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        }
    }
}
