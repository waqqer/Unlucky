import { memo, useEffect, useState } from "react"
import useHead from "@/hooks/useHead"
import styles from "./LeaderboardItem.module.css"
import Badgedeco from "../BadgeDeco"

const top_styles = {
    1: styles.first,
    2: styles.second,
    3: styles.third
}

const LeaderboardItem = (props) => {
    const {
        id,
        uuid = "",
        name = "noname",
        value = 0
    } = props

    const head = useHead(uuid)

    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const checkSize = () => {
            const width = window.innerWidth
            setIsMobile(width <= 630)
            setIsTablet(width <= 1000 && width > 630)
        }

        checkSize()
        window.addEventListener("resize", checkSize)
        return () => window.removeEventListener("resize", checkSize)
    }, [])

    const iconSize = isMobile ? 32 : isTablet ? 36 : 40

    return (
        <div key={id} className={`${styles.leader} ${top_styles[id] || ""} ${isTablet || isMobile ? styles.mobile : ""}`}>
            <div className={styles.info}>
                <h2 className={styles.id}>#{id}</h2>
                <div className={`${styles.user}`}>
                    <img 
                        src={head} 
                        alt="leader head icon" 
                        draggable={false}
                        loading="lazy"
                        width={iconSize}
                        height={iconSize}
                    />
                    <h2 className={styles.name}>
                        {name || "noname"}
                    </h2>

                    <Badgedeco uuid={uuid} className={"mobile-hide"} size={isMobile || isTablet ? 8 : 24} />
                </div>
            </div>

            <h2 className={styles.value}>
                {value || 0} 
                {id === 1 && <i className="fa-solid fa-crown"></i>}
            </h2>
        </div>
    )
}

export default memo(LeaderboardItem)