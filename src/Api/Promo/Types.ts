export interface PromoActivationResult {
    success: boolean
    message: string
    rewards?: {
        balanceAdded?: number
        badgeAdded?: string
    }
}