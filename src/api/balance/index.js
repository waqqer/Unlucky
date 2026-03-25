import { fetchUrl } from "../config"

const URL = fetchUrl + "/balance"

const HEADERS = {
    "Content-Type": "application/json"
}

const BalanceApi = {

    getByName: async (username) => {
        return fetch(URL + `/${username}`)
            .then(data => data.json())
    },

    change: async (username, amount) => {
        let value = 0
        if (typeof amount === "number")
            value = amount

        const data = {
            balance: value
        }

        return fetch(URL + `/${username}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(dat => dat.json())
    }
}

export default BalanceApi