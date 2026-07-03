export interface GameHistory {
    result: "WIN" | "LOSE"
    date: string
    amount: number
    user: {
        name: string
        uuid: string
        badge: string
    }
}

export type GameTitle = "SLOTS" | "BOMBS" | "MINER"
