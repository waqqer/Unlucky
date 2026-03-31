import { memo } from "react"
import styles from "./VictoryVideo.module.css"

const VictoryVideo = (props) => {
    const {
        className
    } = props

    return (
        <video
            className={`${styles["victory-video"]} ${className || ""}`}
            autoPlay
            loop
            muted
            playsInline
        >
            <source src="/assets/victory.mp4" type="video/mp4" />
        </video>
    )
}

export default memo(VictoryVideo)
