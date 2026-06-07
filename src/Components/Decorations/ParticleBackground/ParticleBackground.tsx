import type { Engine, IOptions, RecursivePartial } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import Particles, { ParticlesProvider } from "@tsparticles/react"
import { memo } from "react"
import styles from "./ParticleBackground.module.css"
import type { Classable } from "@/Shared/Types/PropsTypes"

interface ParticleBackgroundProps extends Classable {
    customConfig?: RecursivePartial<IOptions>
    className?: string
}

export const ParticledDefaultConfig: RecursivePartial<IOptions> = {
    key: "basic",
    name: "Basic",
    particles: {
        number: {
            value: 350,
            density: {
                enable: true
            }
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.5
        },
        size: {
            value: { min: 1, max: 3 }
        },
        links: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.35,
            width: 1
        },
        move: {
            enable: true,
            speed: 3
        }
    },
    background: {
        color: "#00000000",
        opacity: 0.1
    }
}

const ParticlesInit = async (engine: Engine) => {
    await loadSlim(engine)
}

const ParticleBackground = (props: ParticleBackgroundProps) => {
    const {
        customConfig = ParticledDefaultConfig,
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