import type { GameContainerRef } from "@/widgets/Games/Layout/GameContainer"

export interface GameRef {
    play: (bet?: number) => void
    playDemo?: () => void
    cashout?: () => void
}

export interface GameProps {
    data: GameContainerRef | null
}

export interface GameBetRange {
    min: number
    default?: number
    max: number
}