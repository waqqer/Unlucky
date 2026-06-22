import { memo, useCallback, useContext, useMemo, useState } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import { AccountContext } from "@/Context/AccountContext"
import Button from "@/Components/Controlls/Buttons/Button"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import SectionTitle from "@/Components/Decorations/SectionTitle"
import Policy from "@/Components/Brand/Policy"
import styles from "./PolicyPage.module.css"

const PolicyPage = () => {
    const { acceptPolicy, account, policy } = useContext(AccountContext)
    const [pending, setPending] = useState<boolean>(false)

    const btnDisabled: boolean = useMemo(() => {
        return !account || !policy || pending
    }, [account, policy, pending])

    const nav = useNavigate()

    const accept = useCallback(() => {
        setPending(true)

        try {
            acceptPolicy()
        } catch {
            toast.error("Ошибка")
            setPending(false)
        }

        nav("/")
    }, [nav])

    return (
        <Page customHeader>
            <ParticleBackground />

            <Section>
                <SectionTitle text="Политика конфиденциальности UnLucky" animate />

                <div className={styles.content}>
                    <Policy />

                    <div className={styles.controlls}>
                        <Button
                            type="SECONDARY"
                            onClick={accept}
                            isDisabled={btnDisabled}
                            sound
                        >
                            {pending ? "Ожидание..." : "Принять политику UnLucky"}
                        </Button>
                    </div>
                </div>
            </Section>
        </Page>
    )
}

export default memo(PolicyPage)