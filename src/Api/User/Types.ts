import type { UserRole, Wallet } from "@/Shared/Types/UserTypes"

export interface UserInfo extends Wallet, UserId {
    userId: number
    
    role: UserRole
    balance: number
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

export interface Badges {
    current_badge: string
    badges: string[]
}

export interface UserHistory {
    id: number
    result: "WIN" | "LOSE"
    game_name: string
    amount: number
    game_date: Date
    user_id: number
}
