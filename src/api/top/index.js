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
    }
}

export default TopApi
