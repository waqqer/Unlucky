export const MINER_CONFIG = {
    MINER_MIN_BET: 10,
    MINER_MAX_BET: 1000,
    MINER_BET_PRESETS: [1, 5, 10, 50, 100],

    ROWS: 5,
    COLS: 5, 

    BLOCKS: {
        "stone": {
            TEXTURE: "",

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 4
        },

        "iron": {
            TEXTURE: "",

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 10
        },

        "obsidian": {
            TEXTURE: "",

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 20
        }
    },

    PICKAXES: {
        "wooden": {
            TEXTURE: "",

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 5
        },

        "iron": {
            TEXTURE: "",

            HIT_SOUND: "",
            BREAK_SOUND: "",

            HEALTH: 10
        },

        "diamond": {
            TEXTURE: "",

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
