export interface UUID {
    minecraftUUID: string
}

export interface UserPayload {
    id: number
    UUID: string
    name: string
    balance: number
    current_badge: string
    badges: string[]
}