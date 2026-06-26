import { memo } from "react"
import Page from "../Page"
import ParticleBackground from "@/Components/Decorations/ParticleBackground"
import Section from "@/Components/Containers/Section"
import AdminHeader from "@/widgets/Admin/Components/AdminHeader"

const AdminPage = () => {
    return (
        <Page customHeader={<AdminHeader />}>
            <ParticleBackground />

            <Section justify="center" align="center">
                <h1>Admin</h1>
            </Section>
        </Page>
    )
}

export default memo(AdminPage)