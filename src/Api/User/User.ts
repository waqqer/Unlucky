import { $api } from "../Api"
import type { Badges, ClaimStreakRewardResult, Policy, StreakReward, UserHistory, UserInfo } from "./Types"
import type { UUID, Wallet } from "@/Shared/Types/UserTypes"

class UserApi {
    public static async getUser(uuid: string | UUID): Promise<UserInfo> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<UserInfo>("/private/api/user/" + param)
        return responce.data
    }

    public static async getUserHistory(uuid: string | UUID): Promise<UserHistory[]> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<UserHistory[]>("/private/api/user/" + param + "/history")
        return responce.data
    }

    public static async getUserBadges(uuid: string | UUID): Promise<Badges> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<Badges>("/private/api/user/" + param + "/badges")
        return responce.data
    }

    public static async getUserBalance(uuid: string | UUID): Promise<Wallet> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<Wallet>("/private/api/user/" + param + "/balance")
        return responce.data
    }

    public static async getStreakRewards(uuid: string | UUID): Promise<StreakReward[]> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<StreakReward[]>("/private/api/user/" + param + "/streak-rewards")
        return responce.data
    }

    public static async claimStreakReward(uuid: string | UUID, day: number): Promise<ClaimStreakRewardResult> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.post<ClaimStreakRewardResult>("/private/api/user/" + param + "/streak-rewards/" + day + "/claim")
        return responce.data
    }

    public static async setUserBadge(uuid: string | UUID, badge: string): Promise<Badges> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.post<Badges>("/private/api/user/" + param + "/badges", {
            badge: badge
        })
        return responce.data
    }

    public static async removeUserBadge(uuid: string | UUID): Promise<void> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        await $api.patch("/private/api/user/" + param + "/badges")
    }

    public static async acceptPolicy(uuid: string | UUID): Promise<Policy> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.patch<Policy>("/private/api/user/" + param + "/policy")
        return responce.data
    }
}

export default UserApi
