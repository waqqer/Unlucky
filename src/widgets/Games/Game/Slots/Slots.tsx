import type { GameProps, GameRef } from "@/Shared/Types/GameTypes"
import { forwardRef, memo } from "react"
import styles from "./Slots.module.css"

const Slots = forwardRef<GameRef, GameProps>((props, ref) => {
    
    return (
        <div>

        </div>
    )
})

export default memo(Slots)