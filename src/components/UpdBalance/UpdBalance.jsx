import { memo, useEffect, useContext } from "react"
import { useLocation } from "react-router"
import { AccountContext } from "@/context/AccountContext"
import BalanceApi from "@/api/balance"

const UpdBalance = () => {
    const {
        account,
        updateUser
    } = useContext(AccountContext)

    const loc = useLocation()

    useEffect(() => {
        if (!account)
            return

        BalanceApi.getByUuid(account.UUID)
            .then(d => {
                const balance = d.balance
                updateUser({ balance })
            })
    }, [loc])

    return null
}

export default memo(UpdBalance)