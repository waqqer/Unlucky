export interface AdminPromocode {
    id: number
    code: string
    balance: number
    badge: string | null
    startDate: string
    endDate: string
    usageLimit: number
    usedCount: number
    isActive: boolean
}

export interface AdminStreakReward {
    id: number
    day: number
    title: string
    description: string
    balance: number
    badge?: string
    isActive: boolean
}

export type AdminPromocodePayload = Omit<AdminPromocode, "id" | "usedCount">
export type AdminStreakRewardPayload = Omit<AdminStreakReward, "id">
