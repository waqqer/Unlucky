import { fetchUrl } from "../config"

const URL = fetchUrl + "/user"

const HEADERS = {
    "Content-Type": "application/json"
}

const UserApi = {

    getAll: (limit) => {
        let l = 20
        if(typeof limit === "number" && limit > 1) 
            l = limit

        return fetch(URL + `?limit=${l}`)
            .then(data => data.json())
    },

    getByName: (username) => {
        return fetch(URL + `/${username}`)
            .then(data => data.json())
    },

    getOrCreate: (sp_user, role) => {
        let r = "USER"
        if(role === "USER" || role === "ADMIN")
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
        }).then(data => data.json())
    }
}

export default UserApi