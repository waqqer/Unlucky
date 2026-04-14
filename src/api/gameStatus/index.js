import { fetchUrl } from "../config"

const BASE_URL = fetchUrl + "/games"

const HEADERS = {
    "Content-Type": "application/json"
}

const GameStatusApi = {
    getAll: async () => {
        return fetch(BASE_URL)
            .then(d => d.json())
    },

    getByName: async (title) => {
        return fetch(BASE_URL + `/${title}`)
            .then(d => d.json())
    },

    update: async (title, state) => {
        const body = {
            state: Boolean(state)
        }
        return fetch(BASE_URL + `/${title}`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(body)
        }
        ).then(d => d.json())
    }
}

export default GameStatusApi