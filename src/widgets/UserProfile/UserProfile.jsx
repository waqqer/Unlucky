import UserInfo from "@/components/UserInfo"
import UserControlls from "@/components/UserControlls"

import "./UserProfile.css"

const UserProfile = () => {
    
    return (
        <div className="profile">
            <UserInfo />
            <UserControlls />
        </div>
    )
}

export default UserProfile