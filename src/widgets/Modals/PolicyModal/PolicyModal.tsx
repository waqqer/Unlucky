import { AccountContext } from "@/Context/AccountContext"
import { memo, useContext } from "react"
import styles from "./PolicyModal.module.css"
import Policy from "@/Components/Brand/Policy"
import Separator from "@/Components/Decorations/Separator"

const PolicyModal = () => {
    const { policy } = useContext(AccountContext)
    
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Условия пользования | Unlucky</h1>
            <Separator size={100} />

            <div className={styles.policy}>
                <Policy />
            </div>

            {policy?.policy_accepts_date && <p className={styles["policy-date"]}>Дата принятия вами политика конфиденциальности: {new Date(policy.policy_accepts_date).toLocaleDateString(
                "ru-RU", {
                month: "2-digit",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
            )}</p>}
        </div>
    )
}

export default memo(PolicyModal)