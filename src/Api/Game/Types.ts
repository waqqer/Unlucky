export interface GameResult {
    multiplier: number,
    isWin: boolean,
    newBalance: number
}

export interface SlotsResult extends GameResult {
    combination: string[]
}

export interface MinerResult extends GameResult {
    field: Field
}

export type Field = {
    pickaxes: string[][],
    blocks: string[][],
    chests: Chest[]
}

export type Chest = {
    quality: string,
    multiplier: number
}