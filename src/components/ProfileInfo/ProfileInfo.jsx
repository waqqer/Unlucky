import styles from "./ProfileInfo.module.css"

const ProfileInfo = (props) => {
    const {
        className
    } = props

    return (
        <div className={`${styles["profile-section"]} ${className}`}>
            <h1 className={styles.nickname}>Username</h1>
            <p className={styles.uuid}>ID: 0001</p>
        </div>
    )
}

export default ProfileInfo