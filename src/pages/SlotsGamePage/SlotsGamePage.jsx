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
import { SYMBOL_IMAGES } from "../../components/SlotReel/SlotReel";

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
                <h2>Описание игры "Слоты"</h2>
                <div className={styles["game-description"]}>
                    <p className="mobile-hide">
                        <strong>Слоты</strong> - игра где нужно выбить в ряд 3 предмета <i>(чем дороже предмет, тем больше <b>X</b>🤫)</i>
                    </p>

                    <h3>• Предметы:</h3>
                    <ol className={styles["item-list"]}>
                        <li>
                            <img src={SYMBOL_IMAGES.star} alt="star" width={64} height={64} />
                            <p><b>(2.7%)</b> - ×5</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.diamond} alt="diamond" width={64} height={64} />
                            <p><b>(7.7%)</b> - ×3</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.gold} alt="gold" width={64} height={64} />
                            <p><b>(11.4%)</b> - ×2</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.iron} alt="iron" width={64} height={64} />
                            <p><b>(18.2%)</b> - ×1.2</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.coal} alt="coal" width={64} height={64} />
                            <p><b>(14.1%)</b> - ×0</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.amethyst} alt="amethyst" width={64} height={64} />
                            <p><b>(2.3%)</b> - ×0</p>
                        </li>
                        <li>
                            <img src={SYMBOL_IMAGES.redstone} alt="redstone" width={64} height={64} />
                            <p><b>(2.3%)</b> - ×0</p>
                        </li>
                    </ol>
                </div>
            </Modal>
        </>
    )
}

export default SlotsGamePage
