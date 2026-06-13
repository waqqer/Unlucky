export interface UUID {
    minecraftUUID: string
}

export interface UserPayload {
    id: number
    UUID: string
    name: string
}

export type UserRole = "USER" | "ADMIN"