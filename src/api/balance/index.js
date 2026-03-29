import { fetchUrl } from "../config"

const URL = fetchUrl + "/balance"

const HEADERS = {
    "Content-Type": "application/json"
}

const BalanceApi = {

    getByName: async (username) => {
        if (!username || username.trim() === "")
            return null

        return fetch(URL + `/${username.trim()}`)
            .then(res => res.json())
    },

    change: async (username, amount) => {
        if (!username || username.trim() === "")
            return null

        let value = 0
        if (typeof amount === "number")
            value = amount

        const data = {
            balance: value
        }

        return fetch(URL + `/${username.trim()}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default BalanceApi