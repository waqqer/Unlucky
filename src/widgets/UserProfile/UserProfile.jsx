import UserInfo from "@/components/UserInfo"
import UserControlls from "@/components/UserControlls"
import Modal from 'react-modal'
import { useCallback, useState } from "react"
import AboutUsModal from "../AboutUsModal"
import ProfileModal from "../ProfileModal"
import { memo } from "react"
import styles from "./UserProfile.module.css"

const UserProfile = (props) => {
    const {
        className,
        children
    } = props


    const [aboutUsModal, setAboutUsModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);

    const openAboutUs = useCallback(() => setAboutUsModal(true))
    const closeAboutUs = useCallback(() => setAboutUsModal(false))

    const openProfile = useCallback(() => setProfileModal(true))
    const closeProfile = useCallback(() => setProfileModal(false))

    return (
        <>
            <nav className={`${styles["profile"]} ${className}`}>
                <UserInfo />
                <UserControlls
                    className={styles["user-controlls"]}
                    openAbout={openAboutUs}
                    openProfile={openProfile}
                >{children}</UserControlls>
            </nav>

            <Modal
                isOpen={aboutUsModal}
                onRequestClose={closeAboutUs}
                contentLabel="О нас"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <AboutUsModal close={closeAboutUs} />
            </Modal>

            <Modal
                isOpen={profileModal}
                onRequestClose={closeProfile}
                contentLabel="Профиль"
                className="modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >
                <ProfileModal close={closeProfile} />
            </Modal>
        </>
    )
}

export default memo(UserProfile)