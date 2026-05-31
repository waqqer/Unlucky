import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/g_stats"

const GStatsApi = {

    get: async () => {
        return authFetch(URL)
            .then(res => res.json())
    },

    gamesStats: async () => {
        return authFetch(URL + "/games")
            .then(res => res.json())
    },

    getUserCount: async () => {
        return authFetch(URL + "/acc_count")
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

        return authFetch(URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default GStatsApi
