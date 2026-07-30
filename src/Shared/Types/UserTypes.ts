export interface UUID {
    minecraftUUID: string
}

export interface UserPayload {
    id: number
    UUID: string
    name: string
}

export interface SPUser {
    accountId: string
    hash: string
    isAdmin: boolean
    minecraftUUID: string
    roles: string[]
    timestamp: number
    username: string
}

export interface Wallet {
    balance: number
}

export type UserRole = "USER" | "ADMIN"
