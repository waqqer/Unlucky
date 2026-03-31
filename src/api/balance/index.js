import { fetchUrl } from "../config"

const URL = fetchUrl + "/balance"

const HEADERS = {
    "Content-Type": "application/json"
}

const BalanceApi = {

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return fetch(URL + `/${uuid.trim()}`)
            .then(res => res.json())
    },

    change: async (uuid, amount) => {
        if (!uuid || uuid.trim() === "")
            return null

        let value = 0
        if (typeof amount === "number")
            value = amount

        const data = {
            balance: value
        }

        return fetch(URL + `/${uuid.trim()}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default BalanceApi
