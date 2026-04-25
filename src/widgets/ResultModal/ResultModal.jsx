import { memo } from "react"
import ModalExitButton from "@/components/ModalExitButton"
import styles from "./ResultModal.module.css"
import Button from "../../components/Button/Button"

const ResultModal = (props) => {
    const {
        message = "",
        succes = true,
        close
    } = props

    return (
        <div className={styles.container}>
            <i
                className={succes ? `fa-solid fa-circle-check ${styles.badge} ${styles.succes}` : `fa-solid fa-circle-exclamation ${styles.badge} ${styles.error}`}
            ></i>

            <p className={styles.message}>{message}</p>

            <Button onClick={close} className={styles.btn}>Закрыть</Button>
        </div>
    )
}

export default memo(ResultModal)