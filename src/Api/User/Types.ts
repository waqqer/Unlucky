import type { UserRole, Wallet } from "@/Shared/Types/UserTypes"

export interface UserInfo extends Wallet {
    userId: number
    
    role: UserRole
    balance: number

    current_badge: string
    badges: string[]
}

export interface BaseUser {
    name: string

    current_badge: string
    badges: string[]
}

export interface UserPresence {
    name: string
    current_badge: string
}