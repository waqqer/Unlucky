import { memo, useContext, useEffect, useState } from "react"
import styles from "./BadgesModal.module.css"
import Separator from "@/Components/Decorations/Separator"
import { BadgesConfig } from "@/Shared/Configs"
import Button from "@/Components/Controlls/Buttons/Button"
import { AccountContext } from "@/Context/AccountContext"

interface UIBadgesModalProps {
    close: () => void
}

const BadgesModal = (props: UIBadgesModalProps) => {
    const {
        close
    } = props

    const { userInfo } = useContext(AccountContext)

    const [picked, setPicked] = useState<string>(Object.entries(BadgesConfig.badges)[0][0])
    const [userBadges, setUserBadges] = useState<string[]>(["slots"])

    useEffect(() => {
        if (userInfo)
            setUserBadges(userInfo.badges)
    }, [userInfo])

    return (
        <div className={styles.content}>
            <h2>Значки</h2>
            <Separator size={100} />

            <div className={styles.badges}>
                <div className={styles.list}>
                    {Object.entries(BadgesConfig.badges).map(([k, v]) => {
                        if (userBadges.includes(k)) {
                            return (
                                <img
                                    src={v.icon}
                                    alt="Badge icon"
                                    className={`${styles.badge} ${styles.has}`}
                                    onClick={() => setPicked(k)}
                                />
                            )
                        }

                        return (
                            <img
                                src={v.icon}
                                alt="Badge icon"
                                className={styles.badge}
                                onClick={() => setPicked(k)}
                            />
                        )
                    })}
                </div>

                <div className={styles.view}>
                    <img
                        src={BadgesConfig.badges[picked]?.icon || ""}
                        alt="Badge preview"
                        className={styles["badge-view"]}
                    />
                    <h2 style={{
                        color: BadgesConfig.colors[
                            BadgesConfig.badges[picked]?.quality
                        ]
                    }}>
                        {BadgesConfig.badges[picked]?.title}
                    </h2>

                    <Separator />

                    <p>
                        {BadgesConfig.badges[picked]?.description}
                    </p>

                    {userBadges.includes(picked) ?
                        <Button type="SECONDARY" onClick={close}>Использовать</Button>
                        :
                        <span className={styles.not}>Значек еще не получен...</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(BadgesModal)