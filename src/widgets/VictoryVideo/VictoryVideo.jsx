import { memo, useEffect, useRef } from "react"
import video from "@/shared/video/victory.webm"
import audio from "@/shared/audio/win.mp3"
import styles from "./VictoryVideo.module.css"

const config = {
    volume: 0.2,
    startTime: 0.2,
    rate: 0.8
}

const VictoryVideo = (props) => {
    const {
        className = ""
    } = props
    
    const audioRef = useRef(null)
    const videoRef = useRef(null)

    useEffect(() => {
        if(audioRef.current) {
            audioRef.current.currentTime = config.startTime
            audioRef.current.volume = config.volume
            audioRef.current.play()
        }
    }, [])

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.playbackRate = config.rate
        }
    }, [])

    return (
        <>
            <video
                ref={videoRef}
                className={`${styles["victory-video"]} ${className}`}
                autoPlay
                muted
                playsInline
            >
                <source src={video} type="video/webm" />
            </video>

            <audio ref={audioRef} src={audio} preload="metadata"/>
        </>
    )
}

export default memo(VictoryVideo)
