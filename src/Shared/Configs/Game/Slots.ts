import * as Slots from "@/Shared/Assets/Games/Slots"
import SpinSound from "@/Shared/Assets/Audio/slot.mp3"

interface SlotsConfig {
    REEL_COUNT: number
    SPIN_SOUND: string
    SYMBOLS: Record<string, string>
    INITIAL_SYMBOLS: string[],
    SPINNING_TIME: number
    CELL_SIZE_PX: number
    REEL_GAP_PX: number
    STAGE_PADDING_PX: number
    SYMBOL_SCALE: number
    STOP_STAGGER_MS: number
    SPIN_TICKS_PER_SEC: number
    SPIN_SOUND_MIN_INTERVAL_MS: number
    SPIN_SOUND_PLAY_MS: number
    AUTO_REROLL_DELAY_MS: number
    SOUND_VOLUME: number
    REEL_TEXTURE: string
}

const Config: SlotsConfig = {
    REEL_COUNT: 3,
    SPIN_SOUND: SpinSound,
    SPINNING_TIME: 3000,
    CELL_SIZE_PX: 112,
    REEL_GAP_PX: 18,
    STAGE_PADDING_PX: 36,
    SYMBOL_SCALE: 0.72,
    STOP_STAGGER_MS: 500,
    SPIN_TICKS_PER_SEC: 7,
    SPIN_SOUND_MIN_INTERVAL_MS: 220,
    SPIN_SOUND_PLAY_MS: 24,
    AUTO_REROLL_DELAY_MS: 420,
    SOUND_VOLUME: 0.18,
    REEL_TEXTURE: Slots.Slot,

    SYMBOLS: {
        "star": Slots.Star,
        "amethyst": Slots.Amethyst,
        "redstone": Slots.Redstone,
        "coal": Slots.Coal,
        "iron": Slots.Iron,
        "gold": Slots.Gold,
        "diamond": Slots.Diamond
    },

    INITIAL_SYMBOLS: ["amethyst", "star", "redstone"],
}

export default Config
