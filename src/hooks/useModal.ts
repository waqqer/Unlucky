import { useCallback, useState } from "react"

type ModalData = {
    isOpen: boolean
    open: () => void
    close: () => void
}

const useModal = (): ModalData => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])

    return {
        isOpen,
        open,
        close
    }
}

export default useModal