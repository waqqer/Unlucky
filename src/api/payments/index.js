import { fetchUrl } from "../config"

const URL = fetchUrl + "/payment"

const HEADERS = {
    "Content-Type": "application/json"
}

const PaymentApi = {
    new: async (amount, uuid) => {
        const body = {
            amount,
            uuid
        }

        return fetch(URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(body)
        }).then(d => d.json())
    },

    transaction: async (number, uuid, amount) => {
        const body ={
            number: String(number),
            uuid: String(uuid),
            amount: Number(amount)
        }

        return fetch(URL + "/out", {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(body)
        }).then(d => d.json())
    }
}

export default PaymentApi
