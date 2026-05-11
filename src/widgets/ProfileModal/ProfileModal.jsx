import ProfileInfo from "@/components/ProfileInfo"
import ModalExitButton from "@/components/ModalExitButton"
import BalanceSection from "../BalanceSection"
import { AccountContext } from "@/context/AccountContext"
import HistorySection from "../HistorySection"
import { memo, useContext } from "react"
import styles from "./ProfileModal.module.css"
import BadgesSection from "../BadgesSection";
 
const ProfileModal = (props) => {
    const {
        close
    } = props

    const { account } = useContext(AccountContext)

    return (
        <>
            <ModalExitButton modal={close} />

            <ProfileInfo />

            <div className={styles.list}>
                <BalanceSection />
                {account?.badges && account?.badges.length > 0 && (<BadgesSection />)}
                <HistorySection className="mobile-hide" />
            </div>
        </>
    )
}

export default memo(ProfileModal)