import { memo, useCallback, useContext, useState } from "react"
import styles from "./TermsPage.module.css"
import Button from "@/components/Button"
import { AccountContext } from "@/context/AccountContext"

const TermsPage = () => {
    const { acceptTerms, user, termsAccepted } = useContext(AccountContext)
    const [accepted, setAccepted] = useState(termsAccepted)

    const acceptHandle = useCallback(() => {
        if (user) {
            setAccepted(true)
            acceptTerms()
        }
    }, [user])

    return (
        <main className={styles.main}>
            <h1>Условия пользования</h1>

            <div className={styles.content}>
                <p className={styles.message}>
                    Тут пока что пусто
                </p>
            </div>

            <div className={styles.controlls}>
                <Button
                    onClick={acceptHandle}
                    className={styles.accept}
                    enabled={accepted}
                >
                    Принять
                </Button>
            </div>
        </main>
    )
}

export default memo(TermsPage)