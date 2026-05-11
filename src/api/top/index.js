import { fetchUrl } from "../config"

const URL = fetchUrl + "/top"

const HEADERS = {
    "Content-Type": "application/json"
}

const TopApi = {
    getWinners: async (limit) => {
        const l = Number(limit) ?? 10
        return fetch(URL + "/win_amount/" + l)
            .then(d => d.json())
    },

    getByWins: async (limit) => {
        const l = Number(limit) ?? 10
        return fetch(URL + "/wins/" + l)
            .then(d => d.json())
    },

    getByBalance: async (limit) => {
        const l = Number(limit) ?? 10
        return fetch(URL + "/money/" + l)
            .then(d => d.json())
    },

    getByGames: async (limit) => {
        const l = Number(limit) ?? 10
        return fetch(URL + "/games/" + l)
            .then(d => d.json())
    }
}

export default TopApi
