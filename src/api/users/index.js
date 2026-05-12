import { fetchUrl } from "../config"

const URL = fetchUrl + "/user"

const HEADERS = {
    "Content-Type": "application/json"
}

const UserApi = {

    getAll: async (limit) => {
        let l = 20
        if (typeof limit === "number" && limit > 1)
            l = limit

        return fetch(URL + `?limit=${l}`)
            .then(res => res.json())
    },

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return fetch(URL + `/${uuid.trim()}`)
            .then(res => res.json())
    },

    getOrCreate: async (sp_user, role) => {
        let r = "USER"
        if (role === "USER" || role === "ADMIN")
            r = role

        const data = {
            name: sp_user.username,
            UUID: sp_user.minecraftUUID,
            role: r
        }

        return fetch(URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: HEADERS
        }).then(res => res.json())
    },

    getCards: async (uuid) => {
        return fetch(URL + `/${uuid.trim()}/cards`)
                .then(res => res.json())
    },

    getBadges: async (uuid) => {
        return fetch(URL + `/${uuid.trim()}/badges`)
                .then(res => res.json())
    },

    setCurrentBadge: async (uuid, badge) => {
        return fetch(URL + `/${uuid.trim()}/badges`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
                badge: badge
            })
        })
    },
    
    acceptTerms: async (uuid) => {
        return fetch(URL + `/${uuid.trim()}/accept`, {
            method: "POST",
            headers: HEADERS
        }).then(res => res.json())
    }
}

export default UserApi
