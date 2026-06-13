import type { IOptions, RecursivePartial } from "@tsparticles/engine"

const Config: RecursivePartial<IOptions> = {
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

export default Config