import * as Slots from "@/Shared/Assets/Games/Slots"
import SpinSound from "@/Shared/Assets/Audio/slot.mp3"

interface SlotsConfig {
    REEL_COUNT: number
    SPIN_SOUND: string
    SYMBOLS: Record<string, string>
    INITIAL_SYMBOLS: string[],
    SPINNING_TIME: number
    STOP_STAGGER_MS: number
    SPIN_TICKS_PER_SEC: number
    SPIN_SOUND_PLAY_MS: number
    AUTO_REROLL_DELAY_MS: number
    SOUND_VOLUME: number
    REEL_TEXTURE: string
    REEL_CONTENT_INSET: string
}

const Config: SlotsConfig = {
    REEL_COUNT: 3,
    SPIN_SOUND: SpinSound,
    SPINNING_TIME: 3000,
    STOP_STAGGER_MS: 500,
    SPIN_TICKS_PER_SEC: 7,
    SPIN_SOUND_PLAY_MS: 24,
    AUTO_REROLL_DELAY_MS: 420,
    SOUND_VOLUME: 0.18,
    REEL_TEXTURE: Slots.Slot,
    REEL_CONTENT_INSET: "10%",

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
