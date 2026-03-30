import UserProfile from "@/widgets/UserProfile"
import ProfileButton from "@/components/ProfileButton"
import SlotMachineGame from "@/widgets/SlotMachineGame"
import GameHistory from "@/widgets/GameHistory"
import Container from "@/components/Container"
import ModalExitButton from "@/components/ModalExitButton"
import { useCallback, useRef, useState } from "react"
import GameExtraControlls from "@/components/GameExtraControlls"
import Modal from 'react-modal'
import styles from "./SlotsGamePage.module.css"

const SlotsGamePage = () => {
    const gameHistoryRef = useRef(null)

    const handleHistoryUpdate = useCallback(() => {
        if (gameHistoryRef.current) {
            gameHistoryRef.current.refreshHistory()
        }
    }, [])

    const [aboutSlots, setAboutSlots] = useState(false)

    const openAboutSlots = useCallback(() => setAboutSlots(true))
    const closeAboutSlots = useCallback(() => setAboutSlots(false))

    return (
        <>
            <header>
                <UserProfile>
                    <ProfileButton text="На главную" link="/"></ProfileButton>
                </UserProfile>
            </header>

            <main className={styles.main}>
                <Container className={styles.container}>
                    <GameExtraControlls aboutOpen={openAboutSlots} />
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

            <Modal
                isOpen={aboutSlots}
                onRequestClose={closeAboutSlots}
                contentLabel="Инструкция к игре `Слоты`"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <ModalExitButton modal={closeAboutSlots} />
                <h2>Инструкция к игре "Слоты"</h2>
                <p style={{opacity: "0.7"}}>sdfjsdfjksdfjsdhjfhsdjf</p>
            </Modal>
        </>
    )
}

export default SlotsGamePage
