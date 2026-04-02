import { fetchUrl } from "../config"

const URL = fetchUrl + "/g_stats"

const HEADERS = {
    "Content-Type": "application/json"
}

const GStatsApi = {

    get: async () => {
        return fetch(URL)
            .then(res => res.json())
    },

    gamesStats: async () => {
        return fetch(URL + "/games")
            .then(res => res.json())
    },

    getOnline: async () => {
        return fetch(URL + "/online")
            .then(res => res.json())
    },

    update: async (stats) => {
        const data = {}

        if (typeof stats?.games_count === "number")
            data.games_count = stats.games_count

        if (typeof stats?.wins_count === "number")
            data.wins_count = stats.wins_count

        if (typeof stats?.loss_count === "number")
            data.loss_count = stats.loss_count

        if (typeof stats?.wins_amount === "number")
            data.wins_amount = stats.wins_amount

        if (typeof stats?.loss_amount === "number")
            data.loss_amount = stats.loss_amount

        if (typeof stats?.total_amount === "number")
            data.total_amount = stats.total_amount

        return fetch(URL, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default GStatsApi
