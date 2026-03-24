import { fetchUrl } from "../config"

const URL = fetchUrl + "/user"

const HEADERS = {
    "Content-Type": "application/json"
}

const UserApi = {

    getAll: (limit) => {
        return fetch(URL + `?limit=${limit}`)
            .then(data => data.json())
    },

    getByName: (username) => {
        return fetch(URL + `/${username}`)
            .then(data => data.json())
    },

    getOrCreate: (sp_user, custom_role) => {
        const data = {
            name: sp_user.username,
            UUID: sp_user.minecraftUUID,
            role: custom_role ?? "USER"
        }

        return fetch(URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: HEADERS
        }).then(data => data.json())
    }
}

export default UserApi