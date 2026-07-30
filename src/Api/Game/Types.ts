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

export type BombsCellKind = "reward" | "empty" | "bomb"
export type BombsRewardKind = "iron" | "gold" | "diamond"

export interface BombsCell {
    index: number
    isOpened: boolean
    kind?: BombsCellKind
    rewardKind?: BombsRewardKind
}

export interface BombsState {
    gameId: string
    multiplier: number
    isWin: boolean
    rows: number
    cols: number
    bet: number
    openedCount: number
    currentWin: number
    isActive: boolean
    cells: BombsCell[]
    newBalance?: number
}

export type BombsSocketResponse = {
    ok: true
    data: BombsState
} | {
    ok: false
    message: string
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
