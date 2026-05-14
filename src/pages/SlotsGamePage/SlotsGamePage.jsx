import UserProfile from "@/widgets/UserProfile"
import SlotMachineGame from "@/widgets/SlotMachineGame"
import GameHistory from "@/widgets/GameHistory"
import Container from "@/components/Container"
import ModalExitButton from "@/components/ModalExitButton"
import Button from "@/components/Button"
import { useCallback, useState } from "react"
import GameExtraControlls from "@/components/GameExtraControlls"
import Modal from 'react-modal'
import styles from "./SlotsGamePage.module.css"

const SlotsGamePage = () => {
    const [refreshCounter, setRefreshCounter] = useState(0)

    const handleHistoryUpdate = useCallback(() => {
        setRefreshCounter(prev => prev + 1)
    }, [])

    const [aboutSlots, setAboutSlots] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)

    const openAboutSlots = useCallback(() => setAboutSlots(true), [])
    const closeAboutSlots = useCallback(() => setAboutSlots(false), [])

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
                    <GameExtraControlls aboutOpen={openAboutSlots}>
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
                            gameName="Слоты"
                            limit={10}
                        />
                        <SlotMachineGame
                            className={styles.game}
                            onHistoryUpdate={handleHistoryUpdate}
                            soundEnabled={soundEnabled}
                        />
                    </div>
                </Container>
            </main>

            <img
                src="https://media.tenor.com/tPfCnUEDWMQAAAAi/frieren-frieren-dance.gif"
                className={`${styles.gif} sp-hide`}
                draggable={false}
                loading="lazy"
            />

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
                <div className={styles["game-description"]}>
                    <p className="mobile-hide">
                        <strong>Слоты</strong> - классическая азартная игра, где вам нужно собрать
                        одинаковые символы на одной линии для победы!
                    </p>

                    <h3>🎮 Как играть:</h3>
                    <ol>
                        <li>Выберите размер ставки (от 1 до 10000 Ар)</li>
                        <li>Нажмите кнопку <strong>"Сыграть"</strong> или пробел</li>
                        <li>Дождитесь результата вращения барабанов</li>
                        <li>Получите выигрыш при совпадении символов!</li>
                    </ol>
                </div>
            </Modal>
        </>
    )
}

export default SlotsGamePage
