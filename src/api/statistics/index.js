import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/stats"

const StatsApi = {

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return authFetch(URL + `/${uuid.trim()}`)
            .then(res => res.json())
    },

    change: async (uuid, wins, losses, games) => {
        let w = 0
        let l = 0
        let g = 1

        if (typeof wins === "number" && wins > 0)
            w = wins

        if (typeof losses === "number" && losses > 0)
            l = losses

        if (typeof games === "number" && games > 0)
            g = games

        const data = {
            wins: w,
            losses: l,
            game_count: g
        }

        return authFetch(URL + `/${uuid.trim()}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default StatsApi
