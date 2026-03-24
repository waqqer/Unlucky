import Button from "../Button"
import styles from "./ModalExitButton.module.css"

const ModalExitButton = (props) => {
    const {
        modal
    } = props

    return (
        <Button className={styles["exit-modal"]} onClick={modal}>
            <i className="fa-regular fa-circle-xmark"></i>
        </Button>
    )
}

export default ModalExitButton