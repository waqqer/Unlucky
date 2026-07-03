import * as Slots from "@/Shared/Assets/Games/Slots"
import SpinSound from "@/Shared/Assets/Audio/slot.mp3"

interface SlotsConfig {
    REEL_COUNT: number
    SPIN_SOUND: string
    SYMBOLS: Record<string, string>
    INITIAL_SYMBOLS: string[],
    SPINNING_TIME: number
}

const Config: SlotsConfig = {
    REEL_COUNT: 3,
    SPIN_SOUND: SpinSound,
    SPINNING_TIME: 5000,

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