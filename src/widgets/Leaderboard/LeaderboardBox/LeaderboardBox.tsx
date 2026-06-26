import { memo, useContext, useEffect, useState } from "react"
import styles from "./LeaderboardBox.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"
import Leaderboard from "../Leaderboard"
import LeaderboardItem from "../LeaderboardItem"
import LeadersApi, { type Leaders } from "@/Api/Leaders"
import { AuthContext } from "@/Context/AuthContext"

const LeaderboardBox = (props: Classable) => {
    const {
        className = ""
    } = props
    
    const { isAuth } = useContext(AuthContext)
    const [leaders, setLeaders] = useState<Leaders>()

    useEffect(() => {
        if(!isAuth) 
            return

        const fetchData = async () => {
            const data = await LeadersApi.getAll(20)
            setLeaders(data)
        }

        fetchData()
    }, [isAuth])

    return (
        <div className={`${styles["leaderbord-box"]} ${className}`}>
            <Leaderboard title="По балансу">
                {leaders?.balanceLeaders?.length > 0 ?
                    leaders.balanceLeaders.map((v, i) => (
                        <LeaderboardItem text="Баланс" value={v.value} name={v.name} uuid={v.UUID} badge={v.badge} index={i + 1} key={i}/>
                    )) : undefined
                }
            </Leaderboard>

            <Leaderboard title="По кол-ву побед">
                {leaders?.winLeaders?.length > 0 ?
                    leaders.winLeaders.map((v, i) => (
                        <LeaderboardItem text="Побед" value={v.value} name={v.name} uuid={v.UUID} badge={v.badge} index={i + 1} key={i}/>
                    )) : undefined
                }
            </Leaderboard>

            <Leaderboard title="По кол-ву игр">
                {leaders?.gameLeaders?.length > 0 ?
                    leaders.gameLeaders.map((v, i) => (
                        <LeaderboardItem text="Игр" value={v.value} name={v.name} uuid={v.UUID} badge={v.badge} index={i + 1} key={i}/>
                    )) : undefined
                }
            </Leaderboard>
        </div>
    )
}

export default memo(LeaderboardBox)