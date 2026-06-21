import { memo, useCallback } from "react"
import Button from "../Button"
import type { UIKeybindedButton } from "../ButtonTypes"
import useKeybind from "@/Hooks/useKeybind"

const KeybindedButton = (props: UIKeybindedButton) => {
    const {
        bind,
        type = "DEFAULT",
        onClick,
        children,
        className = "",
        sound = false,
        isDisabled = false
    } = props

    const handle = useCallback(() => {
        if (onClick)
            onClick()
    }, [onClick])

    useKeybind(bind, handle, {
        preventDefault: true,
        mode: "keydown"
    })

    return (
        <Button
            className={className}
            type={type}
            onClick={handle}
            sound={sound}
            isDisabled={isDisabled}
        >
            {children}
        </Button>
    )
}

export default memo(KeybindedButton)