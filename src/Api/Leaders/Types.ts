export interface Leaders {
    balanceLeaders: Leader[]
    gameLeaders: Leader[]
    winLeaders: Leader[]
}

export interface Leader {
    name: string
    value: number
    UUID: string
}