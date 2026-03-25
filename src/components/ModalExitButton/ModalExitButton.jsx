import Button from "../Button"
import { memo } from "react"
import styles from "./ModalExitButton.module.css"

const ModalExitButton = memo((props) => {
    const {
        modal
    } = props

    return (
        <Button className={styles["exit-modal"]} onClick={modal}>
            <i className="fa-regular fa-circle-xmark"></i>
        </Button>
    )
})

export default ModalExitButton