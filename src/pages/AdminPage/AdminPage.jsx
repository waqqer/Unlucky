import UserProfile from "@/widgets/UserProfile"
import AdminPanel from "@/widgets/AdminPanel"
import ProfileButton from "@/components/ProfileButton"

const AdminPage = () => {
    return (
        <>
            <header>
                <UserProfile>
                    <ProfileButton text="На главную" link="/"></ProfileButton>
                </UserProfile>
            </header>

            <main>
                <AdminPanel />
            </main>
        </>
    )
}

export default AdminPage