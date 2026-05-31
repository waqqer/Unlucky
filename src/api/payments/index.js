import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/payment"

const PaymentApi = {
    new: async (amount, uuid) => {
        const body = {
            amount,
            uuid
        }

        return authFetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(d => d.json())
    },

    transaction: async (number, uuid, amount) => {
        const body = {
            number: String(number),
            uuid: String(uuid),
            amount: Number(amount)
        }

        return authFetch(URL + "/out", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(d => d.json())
    }
}

export default PaymentApi
