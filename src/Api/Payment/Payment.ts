import type { PaymentOutResult, PaymentOut, PaymentDeposit, PaymentDepositResult, UserCard } from "."
import { $api } from "../Api"

class PaymentApi {
    public static async sendTransaction(data: PaymentOut): Promise<PaymentOutResult> {
        return (await $api.post<PaymentOutResult>("/private/api/payments/out", data)).data
    }

    public static async sendDeposit(data: PaymentDeposit): Promise<PaymentDepositResult> {
        return (await $api.post<PaymentDepositResult>("/private/api/payments/deposit", data)).data
    }

    public static async getCards(uuid: string): Promise<UserCard[]> {
        return (await $api.get<UserCard[]>("/private/api/payments/cards/" + uuid)).data
    }
}

export default PaymentApi