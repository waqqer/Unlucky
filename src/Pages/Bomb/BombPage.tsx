import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import BombsGameContainer, { type BombsGameContainerRef, type BombsGameState } from "@/widgets/Games/Layout/BombsGameContainer"
import GameControlls from "@/widgets/Games/Layout/GameControlls"
import Bombs from "@/widgets/Games/Game/Bombs"
import type { GameRef } from "@/Shared/Types/GameTypes"
import { AccountContext } from "@/Context/AccountContext"
import useModal from "@/Hooks/useModal"
import styles from "./BombPage.module.css"
import Window from "@/Components/Containers/Window"
import Separator from "@/Components/Decorations/Separator"

const BombPage = () => {
    const about = useModal()

    const containerRef = useRef<BombsGameContainerRef>(null)
    const gameRef = useRef<GameRef>(null)
    const [gameData, setGameData] = useState<BombsGameContainerRef | null>(null)
    const [isMenuDisabled, setIsMenuDisabled] = useState(false)
    const [isActionPending, setIsActionPending] = useState(false)
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
        gameRef.current?.play(bet)
    }, [])

    const handleCashout = useCallback(() => {
        gameRef.current?.cashout?.()
    }, [])

    const handleGameStateChange = useCallback((state: BombsGameState) => {
        setIsMenuDisabled(state !== "IDLE")
    }, [])

    return (
        <>
            <Page className={styles.page}>
                <ParticleBackground />

                <Section justify="center" align="center" className={styles.game}>
                    <GameControlls openAbout={about.open} onMenuClick={flushBalanceUpdate} isMenuDisabled={isMenuDisabled} />
                    <BombsGameContainer
                        gameName="BOMBS"
                        ref={containerRef}
                        onPlay={handlePlay}
                        onCashout={handleCashout}
                        isActionPending={isActionPending}
                        onStateChange={handleGameStateChange}
                    >
                        <Bombs data={gameData} ref={gameRef} onPendingChange={setIsActionPending} />
                    </BombsGameContainer>
                </Section>
            </Page>

            <Window isOpen={about.isOpen} close={about.close}>
                <div className={styles.modal}>
                    <h2>О игре "Мины"</h2>
                    <Separator />
                    <p>
                        <b>Мины</b> — игра где нужно открывать ячейки на поле, собирать ИКСЫ и вовремя забирать выигрыш, стараясь не наткнуться на мину!
                    </p>
                </div>
            </Window>
        </>
    )
}

export default memo(BombPage)
