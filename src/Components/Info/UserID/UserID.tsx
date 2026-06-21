import type { Identical, UserId } from "@/Api/User"
import { AccountContext } from "@/Context/AccountContext"
import type { Classable } from "@/Shared/Types/PropsTypes"
import { useContext, useEffect, useState, memo } from "react"
import styles from "./UserID.module.css"

interface UIUserIdProps extends Classable {
    data?: UserId | Identical
}

export const IdTransform = (num: number, length: number = 6): string => {
    return num.toString().padStart(length, "0")
}

const UserID = (props: UIUserIdProps) => {
    const {
        className = "",
        data
    } = props

    const { userId } = useContext(AccountContext)
    const [id, setId] = useState<string>("000000")

    useEffect(() => {
        if(!userId) 
            return

        if(data) {
            if("id" in data) {
                setId(IdTransform(data.id))
            } else if("userId" in data) {
                setId(IdTransform(data.userId))
            }
        } else {
            setId(IdTransform(userId))
        }
    }, [userId, data])

    return (
        <h3 className={`${styles.uuid} ${className}`}>
            {id}
        </h3>
    )
}

export default memo(UserID)