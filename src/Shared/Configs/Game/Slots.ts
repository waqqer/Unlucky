import * as Slots from "@/Shared/Assets/Games/Slots"

interface SlotsConfig {
    REEL_COUNT: number
    SYMBOLS: Record<string, string>
    INITIAL_SYMBOLS: string[],
    SPINNING_TIME: number
}

const Config: SlotsConfig = {
    REEL_COUNT: 3,
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