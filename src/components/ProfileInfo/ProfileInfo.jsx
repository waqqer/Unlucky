import "./ProfileInfo.css"

const ProfileInfo = (props) => {
    const {
        className
    } = props

    return (
        <div className={`profile-section ${className}`}>
            <h1 className="title">Username</h1>
            <p className="desc">ID: 0001</p>
        </div>
    )
}

export default ProfileInfo