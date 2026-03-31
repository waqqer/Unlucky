import { fetchUrl } from "../config"

const URL = fetchUrl + "/history"

const HEADERS = {
    "Content-Type": "application/json"
}

const HistoryApi = {

    getAll: async (limit, game) => {
        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        let url = URL + `?limit=${l}`
        if (game)
            url += `&game=${game}`

        return fetch(url)
            .then(res => res.json())
    },

    getByUuid: async (uuid, limit) => {
        if (!uuid || uuid.trim() === "")
            return null

        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        return fetch(URL + `/${uuid.trim()}?limit=${l}`)
            .then(res => res.json())
    },

    create: async (uuid, game_name, result, amount) => {
        let res = "WIN"
        let a = 0

        if (result === "WIN" || result === "LOSE")
            res = result

        if (typeof amount === "number")
            a = amount

        const data = {
            game_name: game_name,
            result: res,
            amount: a
        }

        return fetch(URL + `/${uuid.trim()}`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default HistoryApi
