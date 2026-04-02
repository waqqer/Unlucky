import { fetchUrl } from "../config"

const URL = fetchUrl + "/stats"

const HEADERS = {
    "Content-Type": "application/json"
}

const StatsApi = {

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return fetch(URL + `/${uuid.trim()}`)
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

        return fetch(URL + `/${uuid.trim()}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default StatsApi
