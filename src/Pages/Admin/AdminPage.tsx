import { memo, useRef, useState, useCallback } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import AdminHeader from "@/widgets/Admin/Components/AdminHeader"
import type { AdminHeaderRef, AdminSections } from "@/widgets/Admin/Components/AdminHeader/AdminHeader"
import PromocodesSection from "@/widgets/Admin/Sections/PromocodesSection"
import RewardsSection from "@/widgets/Admin/Sections/RewardsSection"
import StatsSection from "@/widgets/Admin/Sections/StatsSection"

const AdminPage = () => {
    const headerRef = useRef<AdminHeaderRef>(null)
    const [section, setSection] = useState<AdminSections>("STATS")

    const onSectionChange = useCallback((s: AdminSections) => {
        setSection(s)
    }, [])

    return (
        <Page customHeader>
            <AdminHeader ref={headerRef} onSectionChange={onSectionChange}/>
            <ParticleBackground />

            <Section justify="center" align="center">
                {section === "PROMO" && <PromocodesSection />}
                {section === "REWARDS" && <RewardsSection />}
                {section === "STATS" && <StatsSection />}
            </Section>
        </Page>
    )
}

export default memo(AdminPage)
