import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/balance"

const BalanceApi = {

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return authFetch(URL + `/${uuid.trim()}`)
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

        return authFetch(URL + `/${uuid.trim()}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
}

export default BalanceApi
