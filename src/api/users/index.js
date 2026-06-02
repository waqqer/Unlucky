import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/user"

const HEADERS = {
    "Content-Type": "application/json"
}

const UserApi = {

    getAll: async (limit) => {
        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        return authFetch(URL + `?limit=${l}`)
            .then(res => res.json())
    },

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return authFetch(URL + `/${uuid.trim()}`)
            .then(res => res.json())
    },

    getOrCreate: async (sp_user) => {
        return fetch(URL, {
            method: "POST",
            body: JSON.stringify(sp_user),
            headers: HEADERS
        }).then(res => res.json())
    },

    getCards: async (uuid) => {
        return authFetch(URL + `/${uuid.trim()}/cards`)
            .then(res => res.json())
    },

    getBadges: async (uuid) => {
        return authFetch(URL + `/${uuid.trim()}/badges`)
            .then(res => res.json())
    },

    setCurrentBadge: async (uuid, badge) => {
        return authFetch(URL + `/${uuid.trim()}/badges`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
                badge: badge
            })
        })
    },
    
    acceptTerms: async (uuid) => {
        return authFetch(URL + `/${uuid.trim()}/accept`, {
            method: "POST",
            headers: HEADERS
        }).then(res => res.json())
    }
}

export default UserApi
