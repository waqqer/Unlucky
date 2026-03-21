import "./ProfileButton.css"

const ProfileButton = (props) => {
    const {
        text,
        onClick
    } = props

    return (
        <span className="profile-btn" onClick={onClick}>{text}</span>
    )
}

export default ProfileButton