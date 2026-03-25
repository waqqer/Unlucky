import { Link } from "react-router"
import { memo } from "react"
import styles from "./ProfileButton.module.css"

const ProfileButton = (props) => {
    const {
        text,
        onClick,
        link
    } = props

    return (
        <Link className={styles["profile-btn"]} onClick={onClick} to={link} >{text}</Link>
    )
}

export default memo(ProfileButton)