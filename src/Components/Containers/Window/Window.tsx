import type { Parent } from "@/Shared/Types/PropsTypes";
import { memo } from "react"
import Modal from "react-modal"
import "./modal.css"

interface WindowProps extends Parent {
    isOpen: boolean
    closeCallback: () => void,
    label?: string
    className?: string
}

const Window = (props: WindowProps) => {
    const {
        isOpen,
        closeCallback,
        label,
        children,
        className = ""
    } = props
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeCallback}
            closeTimeoutMS={300}
            contentLabel={label}

            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div className={`modal-container-content ${className}`}>
                {children}
            </div>
        </Modal>
    )
}

export default memo(Window)