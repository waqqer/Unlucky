import ProfileInfo from "@/components/ProfileInfo"
import ModalExitButton from "../../components/ModalExitButton"
import "./ProfileModal.css"
import BalanceSection from "../BalanceSection"

const ProfileModal = (props) => {
    const {
        close
    } = props

    return (
        <>
            <ModalExitButton modal={close} />

            <ProfileInfo className="" />

            <BalanceSection />
        </>
    )
}

export default ProfileModal