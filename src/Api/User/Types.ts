import type { UserRole, Wallet } from "@/Shared/Types/UserTypes"

export interface UserInfo extends Wallet, UserId {
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

export interface UserId {
    userId: number
}

export interface Identical {
    id: number
}

export interface UserPresence {
    name: string
    current_badge: string
}