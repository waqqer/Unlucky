import { memo } from "react"
import styles from "./LeaderboardBox.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"
import Leaderboard from "../Leaderboard"
import LeaderboardItem from "../LeaderboardItem"

const LeaderboardBox = (props: Classable) => {
    const {
        className = ""
    } = props

    return (
        <div className={`${styles["leaderbord-box"]} ${className}`}>
            <Leaderboard title="По балансу">
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
            </Leaderboard>

            <Leaderboard title="По кол-ву побед">
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
            </Leaderboard>

            <Leaderboard title="По кол-ву игр">
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1}  />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
                <LeaderboardItem text="Побед" value={1} />
            </Leaderboard>
        </div>
    )
}

export default memo(LeaderboardBox)