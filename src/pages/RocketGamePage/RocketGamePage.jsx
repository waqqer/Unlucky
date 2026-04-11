import UserProfile from "@/widgets/UserProfile"
import RocketGame from "@/widgets/RocketGame"
import GameHistory from "@/widgets/GameHistory"
import Container from "@/components/Container"
import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState } from "react"
import GameExtraControlls from "@/components/GameExtraControlls"
import Modal from 'react-modal'
import styles from "./RocketGamePage.module.css"

const RocketGamePage = () => {
    const [refreshCounter, setRefreshCounter] = useState(0)

    const handleHistoryUpdate = useCallback(() => {
        setRefreshCounter(prev => prev + 1)
    }, [])

    const [aboutRocket, setAboutRocket] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)

    const openAboutRocket = useCallback(() => setAboutRocket(true), [])
    const closeAboutRocket = useCallback(() => setAboutRocket(false), [])

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => !prev)
    }, [])

    return (
        <>
            <header>
                <UserProfile />
            </header>

            <main className={styles.main}>
                <Container className={styles.container}>
                    <GameExtraControlls aboutOpen={openAboutRocket}>
                        <Button
                            className={`${styles["sound-btn"]}`}
                            onClick={toggleSound}
                        >
                            {soundEnabled ? (
                                <i className="fa-solid fa-volume-high"></i>
                            ) : (
                                <i className="fa-solid fa-volume-xmark"></i>
                            )}
                        </Button>
                    </GameExtraControlls>
                    <div className={styles["game-layout"]}>
                        <GameHistory
                            refreshTrigger={refreshCounter}
                            className={styles.history}
                            gameName="Ракета"
                            limit={10}
                        />
                        <RocketGame
                            className={styles.game}
                            onHistoryUpdate={handleHistoryUpdate}
                            soundEnabled={soundEnabled}
                        />
                    </div>
                </Container>
            </main>

            <Modal
                isOpen={aboutRocket}
                onRequestClose={closeAboutRocket}
                contentLabel="Инструкция к игре `Ракета`"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <ModalExitButton modal={closeAboutRocket} />
                <h2>Инструкция к игре "Ракета"</h2>
                <div className={styles["game-description"]}>
                    <p className="mobile-hide">
                        <strong>Ракета</strong> — азартная краш-игра, где нужно успеть забрать выигрыш до того, как ракета взорвётся!
                    </p>

                    <h3>🎮 Как играть:</h3>
                    <ol>
                        <li>Выберите размер ставки (от 1 до 10000 Ар)</li>
                        <li>Нажмите кнопку <strong>"Сыграть"</strong></li>
                        <li>Следите за ростом множителя</li>
                        <li>Нажмите <strong>"Забрать"</strong> до точки краша</li>
                        <li>Если не успели — ставка сгорела!</li>
                    </ol>
                </div>
            </Modal>
        </>
    )
}

export default RocketGamePage
