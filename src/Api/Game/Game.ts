import { $api } from "../Api"
import connectSocket from "../Wss"
import type { UUID } from "@/Shared/Types/UserTypes"
import type { BombsSocketResponse, MinerResult, SlotsResult } from "./Types"

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

    public static createBombsSocket() {
        return connectSocket("/ws/bombs")
    }

    public static emitBombs(socket: ReturnType<typeof connectSocket>, event: "bombs:start", payload: { bet: number }): Promise<BombsSocketResponse>
    public static emitBombs(socket: ReturnType<typeof connectSocket>, event: "bombs:open", payload: { index: number, gameId?: string, requestId?: string }): Promise<BombsSocketResponse>
    public static emitBombs(socket: ReturnType<typeof connectSocket>, event: "bombs:cashout", payload?: { gameId?: string, requestId?: string }): Promise<BombsSocketResponse>
    public static emitBombs(socket: ReturnType<typeof connectSocket>, event: string, payload?: object): Promise<BombsSocketResponse> {
        return new Promise(resolve => {
            const timer = window.setTimeout(() => {
                resolve({ ok: false, message: "Сервер не отвечает" })
            }, 8000)

            socket.emit(event, payload, (response: BombsSocketResponse) => {
                window.clearTimeout(timer)
                resolve(response)
            })
        })
    }
}

export default GameApi
