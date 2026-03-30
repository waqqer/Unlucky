import UserProfile from "@/widgets/UserProfile"
import ProfileButton from "@/components/ProfileButton"
import SlotMachineGame from "@/widgets/SlotMachineGame"
import GameHistory from "@/widgets/GameHistory"
import Container from "@/components/Container"
import { useCallback, useRef } from "react"
import styles from "./SlotsGamePage.module.css"

const SlotsGamePage = () => {
    const gameHistoryRef = useRef(null)

    const handleHistoryUpdate = useCallback(() => {
        if (gameHistoryRef.current) {
            gameHistoryRef.current.refreshHistory()
        }
    }, [])

    return (
        <>
            <header>
                <UserProfile>
                    <ProfileButton text="На главную" link="/"></ProfileButton>
                </UserProfile>
            </header>

            <main className={styles.main}>
                <Container className={styles.container}>
                    <div className={styles["game-layout"]}>
                        <GameHistory
                            ref={gameHistoryRef}
                            className={styles.history}
                            gameName="Слоты"
                            limit={20}
                        />
                        <SlotMachineGame
                            className={styles.game}
                            onHistoryUpdate={handleHistoryUpdate}
                        />
                    </div>
                </Container>
            </main>
        </>
    )
}

export default SlotsGamePage
