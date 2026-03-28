import { fetchUrl } from "../config"

const URL = fetchUrl + "/game/slots"

const HEADERS = {
    "Content-Type": "application/json"
}

export const SlotsApi = {
    spin: async (username, bet) => {
        return await fetch(URL, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ name: username, bet: bet })
        }).then(data => data.json())
    }
}