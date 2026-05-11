import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import styles from "./BadgesSection.module.css"
import Badge from "@/components/Badge"

const BadgesSection = () => {
    const { account } = useContext(AccountContext)

    return (
        <div className={styles["badge-section"]}>
            <div className={styles.box}>
                {account.badges.map((b, i) => <Badge key={i} name={b} />)}
            </div>
        </div>
    )
}

export default BadgesSection