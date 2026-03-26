import UserProfile from "@/widgets/UserProfile"
import AdminPanel from "@/widgets/AdminPanel"

const AdminPage = () => {
    return (
        <>
            <header>
                <UserProfile />
            </header>

            <main>
                <AdminPanel />
            </main>
        </>
    )
}

export default AdminPage