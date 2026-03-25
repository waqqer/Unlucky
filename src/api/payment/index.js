import { fetchUrl } from "../config"

const URL = fetchUrl + "/payment"

const HEADERS = {
    "Content-Type": "application/json"
}

const PaymentApi = {

    getAll: async (limit) => {
        let l = 20
        if(typeof limit === "number" && limit > 1)
            l = limit

        return fetch(URL + `?limit=${l}`)
            .then(data => data.json())
    },

    getByName: async (username, limit) => {
        let l = 20
        if(typeof limit === "number" && limit > 1)
            l = limit

        return fetch(URL + `/${username}?limit=${l}`)
            .then(data => data.json())
    },

    create: async (username, amount, type) => {
        let a = 0
        let t = "ADD"

        if(typeof amount === "number")
            a = amount

        if(type === "ADD" || type === "TAKE")
            t = type

        const data = {
            amount: a,
            type: t
        }

        return fetch(URL + `/${username}`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(data)
        }).then(dat => dat.json())
    }
}

export default PaymentApi