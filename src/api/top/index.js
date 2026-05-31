import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/top"

const TopApi = {
    getWinners: async (limit) => {
        const l = Number(limit) || 10
        return authFetch(URL + "/win_amount/" + l).then(d => d.json())
    },

    getByWins: async (limit) => {
        const l = Number(limit) || 10
        return authFetch(URL + "/wins/" + l).then(d => d.json())
    },

    getByBalance: async (limit) => {
        const l = Number(limit) || 10
        return authFetch(URL + "/money/" + l).then(d => d.json())
    },

    getByGames: async (limit) => {
        const l = Number(limit) || 10
        return authFetch(URL + "/games/" + l).then(d => d.json())
    }
}

export default TopApi
