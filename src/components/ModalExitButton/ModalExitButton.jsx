import Button from "../Button"
import "./ModalExitButton.css"

const ModalExitButton = (props) => {
    const {
        modal
    } = props

    return (
        <Button className="exit-modal" onClick={modal}>
            <i className="fa-regular fa-circle-xmark"></i>
        </Button>
    )
}

export default ModalExitButton