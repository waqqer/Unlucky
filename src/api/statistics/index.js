import { fetchUrl } from "../config"

const URL = fetchUrl + "/stats"

const HEADERS = {
    "Content-Type": "application/json"
}

const StatsApi = {

    getByName: async (username) => {
        if (!username || username.trim() === "")
            return null

        return fetch(URL + `/${username.trim()}`)
            .then(res => res.json())
    },

    change: async (username, wins, losses, games) => {
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
            games: g
        }

        return fetch(URL + `/${username.trim()}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default StatsApi