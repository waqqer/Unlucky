import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/history"

const HistoryApi = {

    getAll: async (limit, game) => {
        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        let url = URL + `?limit=${l}`
        if (game)
            url += `&game=${game}`

        return authFetch(url)
            .then(res => res.json())
    },

    getByUuid: async (uuid, limit) => {
        if (!uuid || uuid.trim() === "")
            return null

        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        return authFetch(URL + `/${uuid.trim()}?limit=${l}`)
            .then(res => res.json())
    }
}

export default HistoryApi
