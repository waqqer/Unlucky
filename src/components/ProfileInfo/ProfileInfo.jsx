import styles from "./ProfileInfo.module.css"

const ProfileInfo = (props) => {
    const {
        className
    } = props

    return (
        <div className={`${styles["profile-section"]} ${className}`}>
            <h1 className="title">Username</h1>
            <p className="desc">ID: 0001</p>
        </div>
    )
}

export default ProfileInfo