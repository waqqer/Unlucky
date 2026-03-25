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

            <ProfileInfo className="" />

            <BalanceSection />
            <HistorySection />
        </>
    )
}

export default memo(ProfileModal)