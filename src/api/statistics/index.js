import { fetchUrl } from "../config"

const URL = fetchUrl + "/stats"

const HEADERS = {
    "Content-Type": "application/json"
}

const StatsApi = {
    
    getByName: async (username) => {
        const u = username.trim()
        if(u === null || u === undefined || usurname === "")
            return null
        
        return fetch(URL + `/${username}`)
            .then(data => data.json())
    },

    change: async (username, wins, losses, games) => {
        let w = 0
        let l = 0
        let g = 1

        if(typeof wins === "number" && wins > 0)
            w = wins

        if(typeof wins === "number" && losses > 0)
            l = losses

        if(typeof wins === "number" && games > 0)
            g = games

        const data = {
            wins: w,
            losses: l,
            games: g
        }

        return fetch(URL + `/${username}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(dat => dat.json())
    }
}

export default StatsApi