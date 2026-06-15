import { useCallback, useState } from "react"

interface ModalHookValues {
    isOpen: boolean
    open: () => void
    close: () => void
}

const useModal = (initialValue?: boolean): ModalHookValues => {
    const [isOpen, setIsOpen] = useState<boolean>(initialValue || false)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])

    return {
        isOpen,
        open,
        close
    }
}

export default useModal