import { useEffect, useRef } from "react"

type KeybindConfig = {
    onRepeating?: boolean
    mode?: "keydown" | "keyup" | "keypress",
    element?: HTMLElement | Window | Document,
    preventDefault?: boolean
}

type KeybindHookCallback = () => void

const useKeybind = (key: string, callback: KeybindHookCallback, config?: KeybindConfig) => {
    const {
        onRepeating = false,
        mode = "keydown",
        element = window,
        preventDefault = false
    } = config || {}

    const callbackRef = useRef<KeybindHookCallback>(callback)

    useEffect(() => {
        const handle = (event: Event) => {
            const ev = event as KeyboardEvent
            if (ev.key !== key)
                return

            if (onRepeating === false && ev.repeat) return
            if (onRepeating === true && !ev.repeat) return

            if (preventDefault) {
                ev.preventDefault()
            }

            callbackRef.current()
        }

        element.addEventListener(mode, handle)

        return () => {
            element.removeEventListener(mode, handle)
        }
    }, [element, mode, onRepeating, key, preventDefault])
}

export default useKeybind