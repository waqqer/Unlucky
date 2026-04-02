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
    }
}

export default PaymentApi
