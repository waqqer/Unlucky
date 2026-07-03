import type { GameHistory, GameTitle } from "./Types";
import { $api } from "../Api";

class HistoryApi {
    public static async getGameHistory(gameName: GameTitle | string, limit: number = 20): Promise<GameHistory[]> {
        const l = Math.max(1, limit)
        return (await $api.get<GameHistory[]>(`/private/api/history/${gameName}?limit=${l}`)).data
    }
}

export default HistoryApi
