import { $api } from "../Api"
import type { AdminPromocode, AdminPromocodePayload, AdminStreakReward, AdminStreakRewardPayload } from "./Types"

class AdminApi {
    public static async getPromocodes(): Promise<AdminPromocode[]> {
        return (await $api.get<AdminPromocode[]>("/private/api/admin/promocodes")).data
    }

    public static async createPromocode(data: AdminPromocodePayload): Promise<AdminPromocode> {
        return (await $api.post<AdminPromocode>("/private/api/admin/promocodes", data)).data
    }

    public static async updatePromocode(id: number, data: Partial<AdminPromocodePayload> & { usedCount?: number }): Promise<AdminPromocode> {
        return (await $api.patch<AdminPromocode>(`/private/api/admin/promocodes/${id}`, data)).data
    }

    public static async deletePromocode(id: number): Promise<void> {
        await $api.delete(`/private/api/admin/promocodes/${id}`)
    }

    public static async getStreakRewards(): Promise<AdminStreakReward[]> {
        return (await $api.get<AdminStreakReward[]>("/private/api/admin/streak-rewards")).data
    }

    public static async createStreakReward(data: AdminStreakRewardPayload): Promise<AdminStreakReward> {
        return (await $api.post<AdminStreakReward>("/private/api/admin/streak-rewards", data)).data
    }

    public static async updateStreakReward(id: number, data: Partial<AdminStreakRewardPayload>): Promise<AdminStreakReward> {
        return (await $api.patch<AdminStreakReward>(`/private/api/admin/streak-rewards/${id}`, data)).data
    }

    public static async deleteStreakReward(id: number): Promise<void> {
        await $api.delete(`/private/api/admin/streak-rewards/${id}`)
    }
}

export default AdminApi
