import UserInfo from "@/components/UserInfo"
import UserControlls from "@/components/UserControlls"

import "./UserProfile.css"

const UserProfile = () => {
    
    return (
        <nav className="profile">
            <UserInfo />
            <UserControlls />
        </nav>
    )
}

export default UserProfile