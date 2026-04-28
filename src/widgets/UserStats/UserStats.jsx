import { memo, useEffect, useState } from "react"
import TopApi from "../../api/top"

const limit = 20

const UserStats = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        TopApi.getWinners(20)
            .then(d => setUsers(d))
    }, [])

    return (
        <div>
            {users.map(e => {
                <p>e.uuid</p>
            })}
        </div>
    )
}

export default memo(UserStats)