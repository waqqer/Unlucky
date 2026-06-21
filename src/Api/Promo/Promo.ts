import { $api } from "../Api"
import type { PromoActivationResult } from "./Types"

class PromoApi {
    public static async activatePromocode(code: string): Promise<PromoActivationResult> {
        return (await $api.post<PromoActivationResult>("/private/api/promo/use", {code})).data
    }
}

export default PromoApi