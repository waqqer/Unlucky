export interface PaymentOut {
    card: string
    amount: number
    uuid: string
    operationId: string
}

export interface PaymentOutResult {
    message: string
    new_balance: number
    operationId?: string
    status?: string
}

export interface PaymentDeposit {
    amount: number
    uuid: string
}

export interface PaymentDepositResult {
    url: string
    code: string
    card: string
}

export interface UserCard {
    name: string
    number: string
}
