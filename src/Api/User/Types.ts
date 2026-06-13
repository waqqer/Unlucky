import type { UserRole } from "@/Shared/Types/UserTypes"

export interface UserInfo {
    userId: number
    
    role: UserRole
    balance: number

    current_badge: string
    badges: string[]
}