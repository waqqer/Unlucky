import Button from "@/Components/Controlls/Buttons/Button"
import type { StreakReward } from "@/Api/User"
import { BadgesConfig } from "@/Shared/Configs"
import { memo, useState } from "react"
import styles from "./StreakRewardsModal.module.css"

interface StreakRewardsModalProps {
    rewards: StreakReward[]
    streak: number
    isLoading?: boolean
    onClaim: (day: number) => Promise<void>
}

const StreakRewardsModal = (props: StreakRewardsModalProps) => {
    const {
        rewards,
        streak,
        isLoading = false,
        onClaim
    } = props

    const [claimingDay, setClaimingDay] = useState<number | null>(null)

    const handleClaim = async (day: number) => {
        setClaimingDay(day)

        try {
            await onClaim(day)
        } finally {
            setClaimingDay(null)
        }
    }

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <span>🔥</span>
                <div>
                    <h2>Награды огонька</h2>
                    <p>Текущая серия: {streak} дн.</p>
                </div>
            </div>

            <div className={styles.rewards}>
                {isLoading && (
                    <p className={styles.message}>Загружаем награды...</p>
                )}

                {!isLoading && rewards.length === 0 && (
                    <p className={styles.message}>Награды пока не настроены</p>
                )}

                {!isLoading && rewards.map(reward => {
                    const progress = Math.min(100, Math.round((streak / reward.day) * 100))
                    const isClaiming = claimingDay === reward.day
                    const badge = reward.badge ? BadgesConfig.badges[reward.badge] : null

                    return (
                        <div
                            className={`${styles.reward} ${reward.isClaimed ? styles.claimed : ""} ${reward.isAvailable ? styles.available : ""}`}
                            key={reward.day}
                        >
                            <div className={styles.rewardTop}>
                                <div>
                                    <h3>{reward.title}</h3>
                                    <p>{reward.description}</p>
                                </div>

                                <div className={styles.prizes}>
                                    <strong>+{reward.balance} Ар</strong>
                                    {badge && (
                                        <span
                                            className={styles.badgePrize}
                                            style={{ color: BadgesConfig.colors[badge.quality] }}
                                        >
                                            + {badge.title}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.progress}>
                                <span style={{ width: `${progress}%` }} />
                            </div>

                            <div className={styles.rewardBottom}>
                                <span>{streak >= reward.day ? reward.day : streak}/{reward.day} дн.</span>

                                {reward.isClaimed ? (
                                    <p className={styles.status}>Получено</p>
                                ) : (
                                    <Button
                                        className={styles.claim}
                                        onClick={() => handleClaim(reward.day)}
                                        isDisabled={!reward.isAvailable || isClaiming}
                                    >
                                        {isClaiming ? "..." : "Забрать"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(StreakRewardsModal)
