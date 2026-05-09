import { fetchUrl } from "../config"

const URL = fetchUrl + "/card"

const HEADERS = {
    "Content-Type": "application/json"
}

const CardApi = {
    CardInfo: async () => {
        return fetch(URL).then(e => e.json())
    }
}

export default CardApi
