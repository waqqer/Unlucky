import { memo } from "react"
import video from "@/shared/video/victory.webm"
import styles from "./VictoryVideo.module.css"

const VictoryVideo = (props) => {
    const {
        className = ""
    } = props

    return (
        <video
            className={`${styles["victory-video"]} ${className}`}
            autoPlay
            loop
            playsInline
        >
            <source src={video} type="video/webm" />
        </video>
    )
}

export default memo(VictoryVideo)
