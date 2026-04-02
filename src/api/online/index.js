import { fetchUrl } from "../config"

const URL = fetchUrl + "/online"

const OnlineApi = {
    increment: async () => {
        return fetch(URL + "/increment", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json())
    },

    decrement: async () => {
        return fetch(URL + "/decrement", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json())
    }
}

export default OnlineApi
