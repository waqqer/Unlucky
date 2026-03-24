import styles from "./ProfileButton.module.css"

const ProfileButton = (props) => {
    const {
        text,
        onClick
    } = props

    return (
        <span className={styles["profile-btn"]} onClick={onClick}>{text}</span>
    )
}

export default ProfileButton