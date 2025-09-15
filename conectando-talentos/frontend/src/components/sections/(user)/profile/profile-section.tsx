'use client'

import { useSessionContext } from "@/components/user/session/context"
import { Container } from "react-bootstrap"

import ProfileForm from "@/components/user/profile/forms/profileform"

export default function ProfileSection() {
    const { userInfo, updateUserInfo } = useSessionContext()

    return (
        <Container className="bg-white border rounded-3 p-4 shadow-sm">
            <h1 className="fs-3 fw-bold m-0">Dados Pessoais</h1>
            <span>Preencha suas informações pessoais</span>

            {userInfo && (
                <ProfileForm info={userInfo} updateInfo={updateUserInfo} />
            )}
        </Container>
    )
}