import { $api } from "../Api"
import type { UUID } from "@/Shared/Types/UserTypes"
import type { MinerResult, SlotsResult } from "./Types"

class GameApi {
    public static async playSlots(uuid: string | UUID, bet: number): Promise<SlotsResult> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.post<SlotsResult>("/private/api/game/slots/" + param, {
            bet
        })
        return responce.data
    }

    public static async playDemoSlots(): Promise<SlotsResult> {
        const responce = await $api.get<SlotsResult>("/private/api/game/slots")
        return responce.data
    }

    public static async playMiner(uuid: string | UUID, bet: number): Promise<MinerResult> {
        const param = typeof uuid === "string" ? uuid : uuid.minecraftUUID
        const responce = await $api.post<MinerResult>("/private/api/game/miner/" + param, {
            bet
        })
        return responce.data
    }
}

export default GameApi