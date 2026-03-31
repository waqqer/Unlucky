import ProfileInfo from "@/components/ProfileInfo"
import ModalExitButton from "@/components/ModalExitButton"
import BalanceSection from "../BalanceSection"
import HistorySection from "../HistorySection"
import { memo } from "react"
 
const ProfileModal = (props) => {
    const {
        close
    } = props

    return (
        <>
            <ModalExitButton modal={close} />

            <ProfileInfo />

            <BalanceSection />
            <HistorySection className="sp-hide" />
        </>
    )
}

export default memo(ProfileModal)