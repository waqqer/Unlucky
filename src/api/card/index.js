import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/card"

const CardApi = {
    CardInfo: async () => {
        return authFetch(URL).then(e => e.json())
    }
}

export default CardApi
