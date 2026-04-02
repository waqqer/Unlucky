import { fetchUrl } from "../config"

export const URL = fetchUrl + "/online"

const OnlineApi = {
    URL,

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
