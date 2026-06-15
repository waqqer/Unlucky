import { memo } from "react"
import NavButton from "../NavButton/NavButton"
import styles from "./UserControlls.module.css"
import useModal from "@/Hooks/useModal"
import Window from "@/Components/Containers/Window"
import AboutUsModal from "@/widgets/Modals/AboutUsModal"
import ProfileModal from "@/widgets/Modals/ProfileModal"

const UserControlls = () => {
    const about = useModal()
    const profile = useModal()

    return (
        <>
            <nav className={styles.controlls}>
                <NavButton onClick={profile.open}>
                    Профиль
                </NavButton >

                <NavButton>
                    Адм. панель
                </NavButton>

                <NavButton onClick={about.open}>
                    О нас
                </NavButton>
            </nav>

            <Window isOpen={about.isOpen} close={about.close}>
                <AboutUsModal />
            </Window>

            <Window isOpen={profile.isOpen} close={profile.close}>
                <ProfileModal />
            </Window>
        </>
    )
}

export default memo(UserControlls)