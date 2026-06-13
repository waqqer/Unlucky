import { $api } from "../Api"
import type { UserInfo } from "./Types";
import type { UUID } from "@/Shared/Types/UserTypes";

class UserApi {
    public static async getUser(uuid: string | UUID): Promise<UserInfo> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.get<UserInfo>("/private/api/user/" + param)
        return responce.data
    }
}

export default UserApi