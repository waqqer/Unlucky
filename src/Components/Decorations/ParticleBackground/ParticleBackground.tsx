import type { Engine, IOptions, RecursivePartial } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import Particles, { ParticlesProvider } from "@tsparticles/react"
import { memo } from "react"
import styles from "./ParticleBackground.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"
import Config from "./Config"

interface ParticleBackgroundProps extends Classable {
    customConfig?: RecursivePartial<IOptions>
    className?: string
}

const ParticlesInit = async (engine: Engine) => {
    await loadSlim(engine)
}

const ParticleBackground = (props: ParticleBackgroundProps) => {
    const {
        customConfig = Config,
        className = ""
    } = props

    return (
        <div className={`${styles.bg} ${className}`}>
            <ParticlesProvider init={ParticlesInit}>
                <Particles
                    id={styles.particles}           
                    options={customConfig}
                />
            </ParticlesProvider>
            <div className={styles.blur}></div>
        </div>
    )
}

export default memo(ParticleBackground)