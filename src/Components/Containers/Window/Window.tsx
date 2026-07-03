import type { Parent } from "@/Shared/Types/PropsTypes"
import { memo } from "react"
import Modal from "react-modal"
import "./Modal.css"

interface UIModalProps extends Parent {
    isOpen: boolean,
    close?: () => void
}

const Window = (props: UIModalProps) => {
    const {
        isOpen,
        close,
        children
    } = props

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={close}
            closeTimeoutMS={300}

            className="modal-content"
            overlayClassName="modal-overlay"
            bodyOpenClassName="modal-body-open"
        >
            {children}
        </Modal>
    )
}

export default memo(Window)
