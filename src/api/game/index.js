import { fetchUrl } from "../config"

const BASE_URL = fetchUrl + "/game"

const HEADERS = {
    "Content-Type": "application/json"
}

export const SlotsApi = {
    spin: async (username, bet) => {
        return await fetch(BASE_URL + "/slots", {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ name: username, bet: bet })
        }).then(res => res.json())
    }
}

export const RocketApi = {
    play: async (username, bet, targetMultiplier) => {
        const body = {
            name: username,
            bet: bet
        }
        if (typeof targetMultiplier === "number" && targetMultiplier > 1.01) {
            body.targetMultiplier = targetMultiplier
        }

        return await fetch(BASE_URL + "/rocket", {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(body)
        }).then(res => res.json())
    }
}

export const MinerApi = {
    play: async () => {
        return await fetch(BASE_URL + "/miner", {
            method: 'POST',
            headers: HEADERS
        }).then(res => res.json())
    }
}