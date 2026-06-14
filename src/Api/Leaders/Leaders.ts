import { $api } from "../Api"
import type { Leaders } from "./Types"

class LeadersApi {
    public static async getAll(limit?: number): Promise<Leaders> {
        return (await $api.get<Leaders>("/private/api/leader?limit=" + String(limit || 20))).data
    }
}

export default LeadersApi