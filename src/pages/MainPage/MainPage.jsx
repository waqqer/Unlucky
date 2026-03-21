import Title from "@/components/Title"
import UserProfile from "../../widgets/UserProfile"

const MainPage = () => {
    return (
        <div>
            <UserProfile />
            <Title title="Unlucky" desc={`Hello, hello}`} />
        </div>
    )
}

export default MainPage