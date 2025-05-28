import { Container } from "react-bootstrap"

import ProfileForms from "../../../components/sections/(company)/profile/profile"

export default function Profile() {
    return (
        <main className="w-100 d-flex flex-column justify-content-start align-items-center overflow-y-auto p-4" >
            <Container className="bg-white border rounded-3 p-4 shadow-sm">
                <h1 className="fs-3 fw-bold m-0">Perfil da Empresa</h1>
                <span>Gerencie Informações da sua empresa</span>

                <ProfileForms />
            </Container>
        </main >
    )
}