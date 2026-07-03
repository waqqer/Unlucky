import { memo, useRef, useState, useCallback } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import AdminHeader from "@/widgets/Admin/Components/AdminHeader"
import type { AdminHeaderRef, AdminSections } from "@/widgets/Admin/Components/AdminHeader/AdminHeader"

const AdminPage = () => {
    const headerRef = useRef<AdminHeaderRef>(null)
    const [section, setSection] = useState<AdminSections>("CONTROLS")

    const onSectionChange = useCallback((s: AdminSections) => {
        setSection(s)
    }, [])

    return (
        <Page customHeader>
            <AdminHeader ref={headerRef} onSectionChange={onSectionChange}/>
            <ParticleBackground />

            <Section justify="center" align="center">
                <h1>{section}</h1>
            </Section>
        </Page>
    )
}

export default memo(AdminPage)