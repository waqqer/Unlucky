import { fetchUrl } from "../config"

const BASE_URL = fetchUrl + "/game"

const HEADERS = {
    "Content-Type": "application/json"
}

export const SlotsApi = {
    spin: async (uuid, bet) => {
        const requestBody = {
            uuid: uuid,
            bet: typeof bet === "number" ? bet : parseFloat(bet) || 0
        }

        const response = await fetch(BASE_URL + "/slots", {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("SlotsApi.spin error:", response.status, errorText)
            throw new Error(`Slots API error: ${response.status} ${errorText}`)
        }

        return response.json()
    },

    demoSpin: async () => {
        const response = await fetch(BASE_URL + "/slots/demo")

        if (!response.ok) {
            const errorText = await response.text()
            console.error("SlotsApi.demoSpin error:", response.status, errorText)
            throw new Error(`Slots API error: ${response.status} ${errorText}`)
        }

        return response.json()
    }
}

export const RocketApi = {
    play: async (uuid, bet, targetMultiplier) => {
        const body = {
            uuid: uuid,
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
