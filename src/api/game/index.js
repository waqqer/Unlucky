import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const BASE_URL = fetchUrl + "/game"

export const SlotsApi = {
    spin: async (uuid, bet) => {
        const requestBody = {
            uuid: uuid,
            bet: typeof bet === "number" ? bet : parseFloat(bet) || 0
        }

        const response = await authFetch(BASE_URL + "/slots", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Slots API error: ${response.status} ${errorText}`)
        }

        return response.json()
    },

    demoSpin: async () => {
        const response = await fetch(BASE_URL + "/slots/demo")

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Slots API error: ${response.status} ${errorText}`)
        }

        return response.json()
    }
}

export const RocketApi = {
    crash: async () => {
        const response = await authFetch(BASE_URL + "/rocket/crash", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Rocket API error: ${response.status} ${errorText}`)
        }

        return response.json()
    },

    result: async (uuid, bet, multiplier, isWin) => {
        const requestBody = {
            bet: typeof bet === "number" ? bet : parseFloat(bet) || 0,
            multiplier: typeof multiplier === "number" ? multiplier : parseFloat(multiplier) || 0,
            isWin
        }

        const response = await authFetch(BASE_URL + `/rocket/result/${uuid}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Rocket API error: ${response.status} ${errorText}`)
        }

        return response.json()
    }
}

export const MinerApi = {
    play: async (uuid, bet) => {
        const body = {
            uuid,
            bet: typeof bet === "number" ? bet : parseFloat(bet) || 0
        }

        const response = await authFetch(BASE_URL + "/miner", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Miner API error: ${response.status} ${errorText}`)
        }

        return response.json()
    }
}
