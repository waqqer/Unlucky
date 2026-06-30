export interface PaymentOut {
    card: string
    amount: number
    uuid: string
}

export interface PaymentOutResult {
    message: string
    new_balance: number
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