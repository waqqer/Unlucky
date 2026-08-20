import type { GameBetRange } from "@/Shared/Types/GameTypes"

export { default as SlotsConfig } from "./Slots"
export { default as MinerConfig } from "./Miner"
export { default as BombsConfig } from "./Bombs"

export const SlotsBet: GameBetRange = {
    min: 10,
    default: 25,
    max: 1000
}

export const MinerBet: GameBetRange = {
    min: 10,
    default: 25,
    max: 1000
}

export const BombsBet: GameBetRange = {
    min: 10,
    default: 25,
    max: 1000
}