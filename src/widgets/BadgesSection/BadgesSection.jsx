import { memo, useContext, useEffect } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./BadgesSection.module.css"
import Badge from "@/components/Badge"

const BadgesSection = () => {
    const { badges, updateBadges } = useContext(AccountContext)

    useEffect(() => {
        updateBadges()
    }, [updateBadges])

    return (
        <div className={styles["badge-section"]}>
            <div className={styles.box}>
                {badges.map((b, i) => <Badge key={i} name={b} />)}
            </div>
        </div>
    )
}

export default memo(BadgesSection)