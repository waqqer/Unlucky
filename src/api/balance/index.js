import { fetchUrl } from "../config"
import { authFetch } from "../auth"

const URL = fetchUrl + "/balance"

const BalanceApi = {

    getByUuid: async (uuid) => {
        if (!uuid || uuid.trim() === "")
            return null

        return authFetch(URL + `/${uuid.trim()}`)
            .then(res => res.json())
    }
}

export default BalanceApi
