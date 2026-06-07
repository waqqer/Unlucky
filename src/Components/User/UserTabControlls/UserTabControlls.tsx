import { memo, type ReactNode } from "react"
import UserTabButton from "../UserTabButton"

interface UserTabControllsProps {
    children?: ReactNode,
    className?: string
}

const UserTabControlls = (props: UserTabControllsProps) => {
    const {
        children,
        className = ""
    } = props

    return (
        <div className={`${className}`}>
            <UserTabButton>Профиль</UserTabButton>
            <UserTabButton>Адм. панель</UserTabButton>
            <UserTabButton>О нас</UserTabButton>

            {children}
        </div>
    )
}

export default memo(UserTabControlls)