import { memo, type ReactNode } from "react"
import UserTabButton from "../UserTabButton"
import type { Classable, Parent } from "@/Shared/Types/PropsTypes"
import Window from "@/Components/Containers/Window"
import useModal from "@/Hooks/useModal"
import AboutUsModal from "@/widgets/Modals/AboutUsModal"

interface UserTabControllsProps extends Classable, Parent {
    children?: ReactNode,
    className?: string
}

const UserTabControlls = (props: UserTabControllsProps) => {
    const {
        children,
        className = ""
    } = props

    const profile = useModal()
    const about = useModal()

    return (
        <>
            <div className={`${className}`}>
                <UserTabButton onClick={profile.open}>Профиль</UserTabButton>
                <UserTabButton>Адм. панель</UserTabButton>
                <UserTabButton onClick={about.open}>О нас</UserTabButton>

                {children}
            </div>

            <Window
                isOpen={profile.isOpen}
                closeCallback={profile.close}
                label="Profile modal"
            >
                <h1>Hello world</h1>
            </Window>

            <Window
                isOpen={about.isOpen}
                closeCallback={about.close}
                label="About us modal"
            >
                <AboutUsModal />
            </Window>
        </>
    )
}

export default memo(UserTabControlls)