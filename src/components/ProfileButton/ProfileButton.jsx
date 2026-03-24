import { Link } from "react-router"
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

export default ProfileButton