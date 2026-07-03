export interface GameHistory {
    result: "WIN" | "LOSE"
    date: Date
    amount: number
    user: {
        name: string
        uuid: string
    }
}

export type GameTitle = "SLOTS" | "BOMBS" | "MINER"