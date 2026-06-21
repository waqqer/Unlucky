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

    const { badge, badges, account, ReloadUserBadges, changeBadge, removeBadge } = useContext(AccountContext)
    const [picked, setPicked] = useState<string>("slots")

    useEffect(() => {
        if (!account)
            return

        ReloadUserBadges()
    }, [account, ReloadUserBadges])

    return (
        <div className={styles.content}>
            <h2>Значки</h2>
            <Separator size={100} />

            <div className={styles.badges}>
                <div className={styles.list}>
                    {Object.entries(BadgesConfig.badges).map(([k, v]) => {
                        if (v.quality !== "LIMITED" || badges.includes(k)) {
                            return (
                                <img
                                    src={v.icon}
                                    alt="Badge icon"
                                    className={`${styles.badge} ${badges.includes(k) ? styles.has : ""} ${k === badge ? styles.current : ""}`}
                                    onClick={() => setPicked(k)}
                                    draggable={false}
                                    loading="lazy"
                                    key={k}
                                />)
                        }
                    })}
                </div>

                <div className={styles.view}>
                    <img
                        src={BadgesConfig.badges[picked]?.icon || ""}
                        alt="Badge preview"
                        className={styles["badge-view"]}
                        draggable={false}
                        loading="lazy"
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

                    {badges.includes(picked) ?
                        picked === badge ?
                            <Button type="DANGER" onClick={() => {
                                close()
                                removeBadge()
                            }}>Снять</Button>
                            :
                            <Button type="SECONDARY" onClick={() => {
                                close()
                                changeBadge(picked)
                            }}>Использовать</Button>
                        :
                        <span className={styles.not}>Значек еще не получен...</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(BadgesModal)