'use client'

import { Container } from "react-bootstrap"
import { useUserSessionContext } from "@/_session/user/context"

import ProfileForm from "./profile-form"

export default function ProfileSection() {
    const { userInfo, updateUserInfo } = useUserSessionContext()

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