import ProfileInfo from "@/components/ProfileInfo"
import ModalExitButton from "@/components/ModalExitButton"
import BalanceSection from "../BalanceSection"
import HistorySection from "../HistorySection"
import StatsSection from "../StatsSection"
import { memo } from "react"
import styles from "./ProfileModal.module.css"
 
const ProfileModal = (props) => {
    const {
        close
    } = props

    return (
        <>
            <ModalExitButton modal={close} />

            <ProfileInfo />

            <div className={styles.list}>
                <BalanceSection />
                <StatsSection className="mobile-hide" />
                <HistorySection className="sp-hide" />
            </div>
        </>
    )
}

export default memo(ProfileModal)