import { fetchUrl } from "../config"

const URL = fetchUrl + "/history"

const HEADERS = {
    "Content-Type": "application/json"
}

const HistoryApi = {

    getAll: async (limit, game) => {
        let l = 20
        if(typeof limit === "number" && limit > 1) 
            l = limit
        
        return fetch(URL + `?limit=${l}&game=${game}`)
            .then(data => data.json())
    },

    getByName: async (username, limit) => {
        const u = username.trim()
        if(u === null || u === undefined || usurname === "")
            return null
        
        let l = 20
        if(typeof limit === "number" && limit > 1) 
            l = limit

        return fetch(URL + `/${username}?limit=${l}`)
            .then(data => data.json())
    },

    create: async (username, game_name, result, amount) => {
        let res = "WIN"
        let a = 0

        if(result === "WIN" || result === "LOSE")
            res = result

        if(typeof a === "number")
            a = amount

        const data = {
            game_name: game_name,
            result: res,
            amount: a
        }

        return fetch(URL + `/${username}`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(dat => dat.json())
    }
}

export default HistoryApi