import { memo } from "react"
import NavButton from "../NavButton/NavButton"
import styles from "./UserControlls.module.css"
import useModal from "@/Hooks/useModal"
import Window from "@/Components/Containers/Window"
import AboutUsModal from "@/widgets/Modals/AboutUsModal"

const UserControlls = () => {
    const about = useModal()

    return (
        <>
            <nav className={styles.controlls}>
                <NavButton>
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
        </>
    )
}

export default memo(UserControlls)