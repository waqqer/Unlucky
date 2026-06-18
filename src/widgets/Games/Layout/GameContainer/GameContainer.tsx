import { memo } from "react"
import GameHistory from "../GameHistory"
import type { Parent } from "@/Shared/Types/PropsTypes"
import styles from "./GameContainer.module.css"
import Input from "@/Components/Controlls/Inputs/Input"
import Separator from "@/Components/Decorations/Separator"
import Button from "@/Components/Controlls/Buttons/Button"

interface UIGameContainerProps extends Parent {
    type?: "double" | "triple"
}

const GameContainer = (props: UIGameContainerProps) => {
    const {
        type = "double",
        children
    } = props
    return (
        <div className={`${styles["game-box"]} ${styles[type]}`}>
            <GameHistory />

            {type === "double" ?
                <div className={styles["d-box"]}>
                    <div className={styles.game}>
                        {children}
                    </div>

                    <div className={styles.input}>
                        <h2>Ставка</h2>
                        <Separator size={50} />
                        <Input />

                        <Button>Сыграть</Button>
                    </div>
                </div>
                :
                <>
                    <div className={styles.game}>
                        {children}
                    </div>

                    <div className={styles.input}>
                        <Input />
                    </div>
                </>
            }
        </div>
    )
}

export default memo(GameContainer)