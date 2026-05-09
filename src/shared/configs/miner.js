import STONE_BLOCK from "@/shared/images/games/miner/blocks/stone.webp"
import IRON_BLOCK from "@/shared/images/games/miner/blocks/iron.webp"
import OBSIDIAN_BLOCK from "@/shared/images/games/miner/blocks/obsidian.webp"
import GRASS_BLOCK from "@/shared/images/games/miner/blocks/grass.webp"
import BASALT_BLOCK from "@/shared/images/games/miner/blocks/basalt.webp"
import DEEPSLATE_BLOCK from "@/shared/images/games/miner/blocks/deepslate.webp"

import WOODEN_PICKAXE from "@/shared/images/games/miner/pickaxes/wooden_pickaxe.webp"
import IRON_PICKAXE from "@/shared/images/games/miner/pickaxes/iron_pickaxe.webp"
import DIAMOND_PICKAXE from "@/shared/images/games/miner/pickaxes/diamond_pickaxe.webp"
import NETHERITE_PICKAXE from "@/shared/images/games/miner/pickaxes/netherite_pickaxe.webp"

import SLOT_TEXTURE from "@/shared/images/games/miner/slot.webp"
import GLOW_TEXTURE from "@/shared/images/games/miner/glow.webp"

import CHEST_OPEN_SOUND from "@/shared/audio/miner/chests/open.mp3"

import PICKAXE_BREAK from "@/shared/audio/miner/pickaxes/break.mp3"

import PICKAXE_ROULETE_SOUND from "@/shared/audio/slot.mp3"

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

import CHEST from "@/shared/images/games/miner/chests/chest.webp"
import CHEST_OPEN from "@/shared/images/games/miner/chests/chest_open.webp"
import RARE_CHEST from "@/shared/images/games/miner/chests/rare_chest.webp"
import RARE_CHEST_OPEN from "@/shared/images/games/miner/chests/rare_chest_open.webp"
import EPIC_CHEST from "@/shared/images/games/miner/chests/epic_chest.webp"
import EPIC_CHEST_OPEN from "@/shared/images/games/miner/chests/epic_chest_open.webp"

export const MINER_CONFIG = {
    MINER_MIN_BET: 10,
    MINER_MAX_BET: 1000,
    MINER_BET_PRESETS: [10, 25, 50, 100, 250],

    MINER_SOUND_VOLUME: 0.15,
    MINER_PICKAXE_ROULETE_SOUND: PICKAXE_ROULETE_SOUND, 

    ROWS: 5,
    COLS: 5,
    PICKAXE_ROWS: 3,
    CELL_SIZE_PX: 64,
    GRID_GAP_PX: 6,

    PICKAXE_FALL_DURATION_MS: 410,
    PICKAXE_FALL_SPINS: 1,

    PICKAXE_BOUNCE_DURATION_MS: 480,
    PICKAXE_BOUNCE_HEIGHT_MULT: 1.05,
    PICKAXE_ROW_PAUSE_MS: 260,
    PICKAXE_RECOIL_AFTER_BREAK_MS: 130,
    PICKAXE_RECOIL_JUMP_MULT: 0.4,
    PICKAXE_RECOIL_SPIN_TURNS: 0.22,
    PICKAXE_BETWEEN_HIT_DELAY_MS: 10,


    CHEST_GLOW_PARTICLE_DEFAULTS: {
        // Секунды между попытками заспавнить партикл на один сундук
        SPAWN_INTERVAL_SEC: 0.065,
        // Отступ от края ячейки сундука как доля CELL_SIZE_PX
        CELL_PADDING_MULT: 0.1,
        // Скорость: (SPEED_MIN + random * SPEED_RANDOM) * GLOW_SPEED * GLOW_DISTANCE
        SPEED_MIN: 28,
        SPEED_RANDOM: 52,
        // Жизнь
        LIFE_BASE_SEC: 0.72,
        LIFE_RANDOM_SEC: 0.48,
        LIFE_DIST_BASE: 0.72,
        LIFE_DIST_SCALE: 0.22,
        LIFE_DIST_CAP: 1.45,
        // Размер спрайта: SIZE_MIN_PX + random * SIZE_RANDOM_PX
        SIZE_MIN_PX: 7,
        SIZE_RANDOM_PX: 11,
        // Затухание скорости за тик
        DRAG: 0.987,
        // Если у сундука не заданы GLOW_SPEED / GLOW_DISTANCE
        SPEED_MUL_DEFAULT: 0.5,
        DIST_MUL_DEFAULT: 1.75
    },

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

            HEALTH: 6
        },

        "iron": {
            TEXTURE: IRON_BLOCK,
            COLOR: "#c7bdb1",

            HIT_SOUND: BLOCK_HIT,
            BREAK_SOUND: BLOCK_BREAK_NORMAL,

            HEALTH: 8
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

            HEALTH: 13
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

            HEALTH: 22
        }
    },

    PICKAXES: {
        "wooden": {
            TEXTURE: WOODEN_PICKAXE,
            COLOR: "#a0703b",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 10
        },

        "iron": {
            TEXTURE: IRON_PICKAXE,
            COLOR: "#d4d4d4",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 16
        },

        "diamond": {
            TEXTURE: DIAMOND_PICKAXE,
            COLOR: "#35d5e6",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 25
        },

        "netherite": {
            TEXTURE: NETHERITE_PICKAXE,
            COLOR: "#272323",

            HIT_SOUND: "",
            BREAK_SOUND: PICKAXE_BREAK,

            HEALTH: 40
        }
    },

    CHESTS: {
        "common": {
            TEXTURE: CHEST,
            OPEN_TEXTURE: CHEST_OPEN,
            COLOR: "#b87333",

            OPEN_SOUND: CHEST_OPEN_SOUND,

            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        },

        "uncommon": {
            TEXTURE: CHEST,
            OPEN_TEXTURE: CHEST_OPEN,
            COLOR: "#3cb371",

            OPEN_SOUND: CHEST_OPEN_SOUND,

            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: false
        },

        "rare": {
            TEXTURE: RARE_CHEST,
            OPEN_TEXTURE: RARE_CHEST_OPEN,
            COLOR: "#FCB428",

            OPEN_SOUND: CHEST_OPEN_SOUND,

            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: true,
            GLOW_SPEED: 0.45,
            GLOW_DISTANCE: 0.05,
            GLOW_SPAWN_INTERVAL_SEC: 0.05,
            GLOW_CELL_PADDING_MULT: 0.12,
            GLOW_SPEED_MIN: 20,
            GLOW_SPEED_RANDOM: 36,
            GLOW_LIFE_BASE_SEC: 0.55,
            GLOW_DRAG: 0.5
        },

        "epic": {
            TEXTURE: EPIC_CHEST,
            OPEN_TEXTURE: EPIC_CHEST_OPEN,
            COLOR: "#5DF0E9",

            OPEN_SOUND: CHEST_OPEN_SOUND,

            GLOW_TEXTURE: GLOW_TEXTURE,
            GLOW: true,
            GLOW_SPEED: 0.05,
            GLOW_DISTANCE: 15,
            GLOW_SPAWN_INTERVAL_SEC: 0.07,
            GLOW_CELL_PADDING_MULT: 0.08,
            GLOW_SPEED_MIN: 20,
            GLOW_SPEED_RANDOM: 50,
            GLOW_LIFE_BASE_SEC: 0.5,
            GLOW_LIFE_RANDOM_SEC: 0.3,
            GLOW_SIZE_MIN_PX: 5,
            GLOW_SIZE_RANDOM_PX: 10,
            GLOW_DRAG: 0.99
        }
    }
}
