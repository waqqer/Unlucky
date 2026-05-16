import UserProfile from "@/widgets/UserProfile"
import GameHistory from "@/widgets/GameHistory"
import GameExtraControlls from "@/components/GameExtraControlls"
import Button from "@/components/Button"
import Container from "@/components/Container"
import { useCallback, useState } from "react"
import Modal from 'react-modal'
import ModalExitButton from "@/components/ModalExitButton"
import styles from "./MinerGamePage.module.css"
import MinerGame from "../../widgets/MinerGame"

const MinerGamePage = () => {
    const [refreshCounter, setRefreshCounter] = useState(0)

    const handleHistoryUpdate = useCallback(() => {
        setRefreshCounter(prev => prev + 1)
    }, [])

    const [aboutMiner, setAboutMiner] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)

    const openAboutMiner = useCallback(() => setAboutMiner(true), [])
    const closeAboutMiner = useCallback(() => setAboutMiner(false), [])

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
                    <GameExtraControlls aboutOpen={openAboutMiner}>
                        <Button
                            className={styles["sound-btn"]}
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
                            gameName="Майнер"
                            limit={10}
                        />
                        
                        <MinerGame
                            onHistoryUpdate={handleHistoryUpdate}
                            soundEnabled={soundEnabled}
                        />
                    </div>
                </Container>
            </main>

            <Modal
                isOpen={aboutMiner}
                onRequestClose={closeAboutMiner}
                contentLabel="Инструкция к игре `Майнер`"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <ModalExitButton modal={closeAboutMiner} />
                <h2>Описание игры "Майнер"</h2>
                <div className={styles["game-description"]}>
                    <p className="mobile-hide">
                        <strong>Майнер</strong> - игра где рандом решает какие кирки выпадут, какие блоки им предстоит сломать и какой лут ждет в итоге! 
                    </p>
                </div>
            </Modal>
        </>
    )
}

export default MinerGamePage