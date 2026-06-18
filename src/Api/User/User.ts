import { $api } from "../Api"
import type { Badges, UserHistory, UserInfo } from "./Types"
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

    public static async setUserBadge(uuid: string | UUID, badge: string): Promise<Badges> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.post<Badges>("/private/api/user/" + param + "/badges", {
            badge: badge
        })
        return responce.data
    }
}

export default UserApi