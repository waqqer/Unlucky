import "./UserInfo.css"

const UserInfo = () => {

    return (
        <div className="user-about">
            <div className="user-avatar">
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhsb2bSu6WM2dFqnpyyRzVKs1RKepBjTqSOA&s" 
                    alt="Аватар клиента"
                    width={48}
                    height={48}
                />
            </div>
            <dir className="user-info">
                <span className="user-nick">Shadowmonya</span>
                <span className="user-balance">1000 Ар</span>
            </dir>
        </div>
    )
}

export default UserInfo