import type { GameContainerRef } from "@/widgets/Games/Layout/GameContainer"

export interface GameRef {
    play: (bet?: number) => void
    playDemo?: () => void
}

export interface GameProps {
    data: GameContainerRef | null
}
