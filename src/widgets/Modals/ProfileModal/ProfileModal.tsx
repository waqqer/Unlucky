import Separator from "@/Components/Decorations/Separator"
import { memo, useContext, useEffect, useState, useCallback } from "react"
import styles from "./ProfileModal.module.css"
import Head from "@/Components/Decorations/Head"
import Username from "@/Components/Info/Username"
import UserID from "@/Components/Info/UserID"
import Balance from "@/Components/Info/Balance"
import Button from "@/Components/Controlls/Buttons/Button"
import { Tooltip } from "react-tooltip"
import useModal from "@/Hooks/useModal"
import Window from "@/Components/Containers/Window"
import BadgesModal from "../BadgesModal"
import PromoModal from "../PromoModal"
import UserApi, { type UserHistory } from "@/Api/User"
import { AccountContext } from "@/Context/AccountContext"
import DepositModal from "../DepositModal"
import OutModal from "../OutModal"
import StreakRewardsModal from "../StreakRewardsModal"
import type { StreakReward } from "@/Api/User"
import { toast } from "react-toastify"
import { MessengerContext } from "@/Context/MessengerContext"

interface UIProfileModalProps {
    closeThis: () => void
}

const ProfileModal = (props: UIProfileModalProps) => {
    const {
        closeThis
    } = props

    const badges = useModal()
    const promo = useModal()
    const deposit = useModal()
    const out = useModal()
    const streakRewards = useModal()

    const [history, setHistory] = useState<UserHistory[]>([])
    const [rewards, setRewards] = useState<StreakReward[]>([])
    const [isRewardsLoading, setIsRewardsLoading] = useState<boolean>(false)
    const { account, streak, streakStatus, setBalanceTo, addBadge } = useContext(AccountContext)
    const { setBadgeMessage } = useContext(MessengerContext)

    useEffect(() => {
        if (!account) return

        UserApi.getUserHistory(account.UUID).then(d => setHistory(d))
    }, [account])

    useEffect(() => {
        if (!account) return

        setIsRewardsLoading(true)
        UserApi.getStreakRewards(account.UUID)
            .then(d => setRewards(d))
            .finally(() => setIsRewardsLoading(false))
    }, [account, streak])

    const onPromoActivateCallback = useCallback(() => {
        promo.close()
        closeThis()
    }, [closeThis, promo.close])

    const onDepositCallback = useCallback(() => {
        deposit.close(),
        closeThis()
    }, [deposit, closeThis])

    const onOutCallback = useCallback(() => {
        out.close()
        closeThis()
    }, [out, closeThis])

    const handleClaimReward = useCallback(async (day: number) => {
        if (!account) return

        try {
            const data = await UserApi.claimStreakReward(account.UUID, day)
            setBalanceTo(data.balance)
            setRewards(prev => prev.map(reward => (
                reward.day === data.reward.day ? data.reward : reward
            )))

            if (data.reward.badge) {
                addBadge(data.reward.badge)
                setBadgeMessage(data.reward.badge)
            }

            toast.success(`Награда огонька получена: +${data.reward.balance} Ар`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Не удалось получить награду")
        }
    }, [account, setBalanceTo, addBadge, setBadgeMessage])

    const statusText = streakStatus === "ACTIVE"
        ? "Огонек активен"
        : streakStatus === "WAITING"
            ? "Сыграй сегодня, чтобы продлить"
            : "Огонек погас"

    const hasStreak = streak > 0 && streakStatus !== "DEAD"
    const nextReward = rewards.find(reward => !reward.isClaimed)

    return (
        <>
            <div className={styles.content}>
                <h2>Профиль</h2>

                <div className={styles.user}>
                    <Head size={52} />

                    <div className={styles.info}>
                        <Username withBadge withFire fireTooltip/>
                        <UserID />
                    </div>
                </div>

                <Separator size={100} />

                <div className={styles.controlls}>
                    <Button className={styles.profile_btn} id="badges" onClick={badges.open}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z" />
                        </svg>
                    </Button>

                    <Button className={styles.profile_btn} id="promocode" onClick={promo.open}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M385.5 132.8C393.1 119.9 406.9 112 421.8 112L424 112C446.1 112 464 129.9 464 152C464 174.1 446.1 192 424 192L350.7 192L385.5 132.8zM254.5 132.8L289.3 192L216 192C193.9 192 176 174.1 176 152C176 129.9 193.9 112 216 112L218.2 112C233.1 112 247 119.9 254.5 132.8zM344.1 108.5L320 149.5L295.9 108.5C279.7 80.9 250.1 64 218.2 64L216 64C167.4 64 128 103.4 128 152C128 166.4 131.5 180 137.6 192L96 192C78.3 192 64 206.3 64 224L64 256C64 273.7 78.3 288 96 288L544 288C561.7 288 576 273.7 576 256L576 224C576 206.3 561.7 192 544 192L502.4 192C508.5 180 512 166.4 512 152C512 103.4 472.6 64 424 64L421.8 64C389.9 64 360.3 80.9 344.1 108.4zM544 336L344 336L344 544L480 544C515.3 544 544 515.3 544 480L544 336zM296 336L96 336L96 480C96 515.3 124.7 544 160 544L296 544L296 336z" />
                        </svg>
                    </Button>

                    <Button className={styles.profile_btn} id="referal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z" />
                        </svg>
                    </Button>
                </div>

                <div className={styles.balance}>
                    <div className={styles.data}>
                        <h4>Баланс: </h4>
                        <Balance className={styles["balance-label"]} />
                    </div>

                    <div className={styles.btns}>
                        <Button className={styles.btn} id="deposit" onClick={deposit.open} isDisabled={account === null}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M31 169C21.6 159.6 21.6 144.4 31 135.1L103 63C112.4 53.6 127.6 53.6 136.9 63C146.2 72.4 146.3 87.6 136.9 96.9L105.9 127.9L173.6 127.9L173.6 127.9L511.9 127.9C547.2 127.9 575.9 156.6 575.9 191.9L575.9 370.1L570.8 365C542.7 336.9 497.1 336.9 469 365C441.8 392.2 440.9 435.6 466.2 463.9L533.9 463.9L502.9 432.9C493.5 423.5 493.5 408.3 502.9 399C512.3 389.7 527.5 389.6 536.8 399L608.8 471C618.2 480.4 618.2 495.6 608.8 504.9L536.8 576.9C527.4 586.3 512.2 586.3 502.9 576.9C493.6 567.5 493.5 552.3 502.9 543L533.9 512L127.8 512C92.5 512 63.8 483.3 63.8 448L63.8 269.8L68.9 274.9C97 303 142.6 303 170.7 274.9C197.9 247.7 198.8 204.3 173.5 176L105.8 176L136.8 207C146.2 216.4 146.2 231.6 136.8 240.9C127.4 250.2 112.2 250.3 102.9 240.9L31 169zM416 320C416 267 373 224 320 224C267 224 224 267 224 320C224 373 267 416 320 416C373 416 416 373 416 320zM504 255.5C508.4 256 512 252.4 512 248L512 200C512 195.6 508.4 192 504 192L456 192C451.6 192 447.9 195.6 448.5 200C452.1 229 475.1 251.9 504 255.5zM136 384.5C131.6 384 128 387.6 128 392L128 440C128 444.4 131.6 448 136 448L184 448C188.4 448 192.1 444.4 191.5 440C187.9 411 164.9 388.1 136 384.5z" />
                            </svg>
                        </Button>
                        <Button className={styles.btn} id="cashout" onClick={out.open} isDisabled={account === null}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M64 173.5L64 483.6C64 503 75.8 520.9 94.3 526.9C188.3 556.9 253.1 535.3 317.6 513.8C380 493 442 472.3 529.7 498.5C551.9 505.1 575.9 489.7 575.9 466.5L575.9 156.4C575.9 137 564.1 119.1 545.6 113.1C451.6 83.1 386.8 104.7 322.3 126.2C259.9 147 197.9 167.7 110.2 141.5C88 134.9 63.9 150.3 63.9 173.5zM320 432C267 432 224 381.9 224 320C224 258.1 267 208 320 208C373 208 416 258.1 416 320C416 381.9 373 432 320 432zM191.1 469.5C191.8 473.9 188.3 477.6 183.9 477.6C168.2 477.6 151.8 475.8 133.9 471.5C130.4 470.7 127.9 467.5 127.9 463.8L128 424C128 419.6 131.6 415.9 136 416.5C164.1 420 186.6 441.7 191.2 469.5zM512 418.6C512 423.6 507.4 427.4 502.5 426.6C487.1 424.1 472.3 422.7 458.1 422.3C453.2 422.2 449.4 417.8 450.9 413.1C458.2 389.4 478.9 371.7 504.1 368.5C508.5 368 512.1 371.6 512.1 376L512.1 418.6zM504 223.5C475.9 220 453.4 198.3 448.8 170.5C448.1 166.1 451.6 162.4 456 162.4C471.7 162.4 488.1 164.2 506 168.5C509.5 169.3 512 172.5 512 176.2L512 216.1C512 220.5 508.4 224.2 504 223.6zM181.9 217.7C186.8 217.8 190.6 222.2 189.1 226.9C181.8 250.6 161.1 268.3 135.9 271.5C131.5 272 127.9 268.4 127.9 264L127.9 221.4C127.9 216.4 132.5 212.6 137.4 213.4C152.8 215.9 167.6 217.3 181.8 217.7zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" />
                            </svg>
                        </Button>
                    </div>
                </div>

                {hasStreak && (
                    <div className={styles.streak}>
                        <div className={styles["streak-info"]}>
                            <div className={styles["streak-fire"]}>🔥</div>

                            <div className={styles["streak-data"]}>
                                <h4>Огонек</h4>
                                <p>{streak} дн. подряд</p>
                                <span>{statusText}</span>
                            </div>
                        </div>

                        <div className={styles["streak-actions"]}>
                            {nextReward && (
                                <p>
                                    Следующая: {nextReward.day} дн. / +{nextReward.balance} Ар
                                </p>
                            )}

                            <Button
                                className={styles["streak-btn"]}
                                id="streak-rewards"
                                onClick={streakRewards.open}
                                isDisabled={account === null}
                            >
                                Награды
                            </Button>
                        </div>
                    </div>
                )}

                <div className={styles.history}>
                    {history.length === 0 ?
                        <p className={styles["history-notfound"]}>Тут ничего нет(...</p>
                        :
                        history.map((v, i) => (
                            <div className={styles["history-item"]}>
                                <div className={styles["history-time-date"]}>
                                    <h1>{v.game_name}</h1>
                                    <p>{new Date(v.game_date).toLocaleDateString("ru-RU", {
                                        month: "short",
                                        year: "numeric",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour: "2-digit",
                                    })}</p>
                                </div>

                                <div className={styles["history-time-info"]}>
                                    <h1>{v.result === "WIN" ? "ПОБЕДА" : "ПОРАЖЕНИЕ"}</h1>
                                    <p className={styles[v.result]}>{v.amount}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <Tooltip
                anchorSelect="#deposit"
                delayShow={100}
                content="Пополнение средств"
                variant="info"
            />

            <Tooltip
                anchorSelect="#cashout"
                delayShow={100}
                content="Вывод средств"
                variant="info"
            />

            <Tooltip
                anchorSelect="#badges"
                delayShow={100}
                content="Значки"
                variant="info"
            />

            <Tooltip
                anchorSelect="#promocode"
                delayShow={100}
                content="Промокоды"
                variant="info"
            />

            <Tooltip
                anchorSelect="#referal"
                delayShow={100}
                content="Реферальная система"
                variant="info"
            />

            <Tooltip
                anchorSelect="#streak-rewards"
                delayShow={100}
                content="Награды за дни огонька"
                variant="info"
            />

            <Window isOpen={badges.isOpen} close={badges.close}>
                <BadgesModal close={badges.close} />
            </Window>

            <Window isOpen={promo.isOpen} close={promo.close}>
                <PromoModal onPromoActivate={onPromoActivateCallback} />
            </Window>

            <Window isOpen={deposit.isOpen} close={deposit.close}>
                <DepositModal onDeposit={onDepositCallback} />
            </Window>

            <Window isOpen={out.isOpen} close={out.close}>
                <OutModal onOut={onOutCallback} />
            </Window>

            <Window isOpen={streakRewards.isOpen} close={streakRewards.close}>
                <StreakRewardsModal
                    rewards={rewards}
                    streak={streak}
                    isLoading={isRewardsLoading}
                    onClaim={handleClaimReward}
                />
            </Window>
        </>
    )
}

export default memo(ProfileModal)
