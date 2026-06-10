import { memo, useMemo, useState, type ReactNode } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import AdmOnlineSection from "./Sections/Online/AdmOnlineSection"
import SideBar from "@/Components/Controlls/SideBar"
import UserTabButton from "@/Components/Controlls/Buttons/UserTabButton"
import AdmStatsSection from "./Sections/Stats/AdmStatsSection"

type AdminSections = {
    [key: string]: ReactNode
}
const AdminSections: AdminSections = {
    "online": (<AdmOnlineSection />),
    "stats": (<AdmStatsSection />)
}

const AdminPage = () => {
    const [currentSec, setCurrentSec] = useState<string>("online")
    
    const header = useMemo(() => (
        <SideBar> 
            <UserTabButton onClick={() => setCurrentSec("online")}>Онлайн</UserTabButton>
            <UserTabButton onClick={() => setCurrentSec("stats")}>Статистика</UserTabButton>
            <UserTabButton link="/">Главная</UserTabButton>
        </SideBar>
    ), [])

    return (
        <Page customHeader={header}>
            <ParticleBackground />

            <Section>
                {AdminSections[currentSec]}
            </Section>
        </Page>
    )
}

export default memo(AdminPage)