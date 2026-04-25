import NotFoundTitle from "@/widgets/NotFoundTitle"
import UserProfile from "@/widgets/UserProfile"
import { memo } from "react"
import styles from "./NotFoundPage.module.css"

const NotFoundPage = () => {

    return (
        <main>
            <NotFoundTitle />
        </main>
    )
}

export default memo(NotFoundPage)