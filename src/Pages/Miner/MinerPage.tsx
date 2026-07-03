import { memo, useRef, useCallback, useEffect, useState, useContext } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import GameContainer, { type GameContainerRef, type GameState } from "@/widgets/Games/Layout/GameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Miner from "@/widgets/Games/Game/Miner"
import { type GameRef } from "@/Shared/Types/GameTypes"
import { toast } from "react-toastify"
import { AccountContext } from "@/Context/AccountContext"
import styles from "./MinerPage.module.css"
import Window from "@/Components/Containers/Window"
import useModal from "@/Hooks/useModal"
import Separator from "@/Components/Decorations/Separator"

const MinerPage = () => {
    const about = useModal()

    const containerRef = useRef<GameContainerRef>(null)
    const gameRef = useRef<GameRef>(null)
    const [gameData, setGameData] = useState<GameContainerRef | null>(null)
    const [isMenuDisabled, setIsMenuDisabled] = useState(false)
    const {
        beginBalanceDeferral,
        endBalanceDeferral,
        flushBalanceUpdate
    } = useContext(AccountContext)

    useEffect(() => {
        setGameData(containerRef.current)
    }, [])

    useEffect(() => {
        beginBalanceDeferral()

        return () => {
            endBalanceDeferral()
        }
    }, [beginBalanceDeferral, endBalanceDeferral])

    const handlePlay = useCallback((bet: number) => {
        const container = containerRef.current
        if (!container) return

        if (container.isAutoreroll || container.isDemo) {
            toast.error("В игре майнер не доступен Авто-реролл и Демо режим")
            return
        }
        if (gameRef.current)
            gameRef.current.play(bet)
    }, [])

    const handleGameStateChange = useCallback((state: GameState) => {
        setIsMenuDisabled(state !== "IDLE")
    }, [])

    return (
        <>
            <Page>
                <ParticleBackground />

                <Section justify="center" align="center">
                    <GameControlls openAbout={about.open} onMenuClick={flushBalanceUpdate} isMenuDisabled={isMenuDisabled} />
                    <GameContainer gameName="MINER" type="triple" demo={false} autoreroll={false} ref={containerRef} onPlay={handlePlay} onStateChange={handleGameStateChange}>
                        <Miner data={gameData} ref={gameRef} />
                    </GameContainer>
                </Section>
            </Page>

            <Window isOpen={about.isOpen} close={about.close}>
                <div className={styles.modal}>
                    <h2>О игре "Майнер"</h2>
                    <Separator />
                    <p>
                        <strong>Майнер</strong> - игра где рандом решает какие кирки выпадут, какие блоки им предстоит сломать и какой лут ждет в итоге!
                    </p>
                </div>
            </Window>
        </>
    )
}

export default memo(MinerPage)
