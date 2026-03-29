import UserProfile from "@/widgets/UserProfile"
import ProfileButton from "@/components/ProfileButton"
import SlotMachineGame from "@/widgets/SlotMachineGame"
import GameHistory from "@/widgets/GameHistory"
import Container from "@/components/Container"
import styles from "./SlotsGamePage.module.css"

const SlotsGamePage = () => {

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
                            className={styles.history} 
                            gameName="Слоты" 
                        />
                        <SlotMachineGame 
                            className={styles.game} 
                        />
                    </div>
                </Container>
            </main>
        </>
    )
}

export default SlotsGamePage
