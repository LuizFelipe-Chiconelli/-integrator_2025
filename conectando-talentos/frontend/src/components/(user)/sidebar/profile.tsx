'use client'

import { useUserSessionContext } from "@/_session/user/context"

export default function Profile() {
    const { userInfo } = useUserSessionContext()

    const nameList: string[] | undefined = userInfo?.pessoa_fisica.nome.split(" ")
    const name = nameList && nameList.length > 1 ? `${nameList[0]} ${nameList[1]}` : userInfo?.pessoa_fisica.nome

    return (
        <div className="d-flex align-items-center gap-2 px-2">
            <img
                className="border"
                src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                alt="logo da empresa"
                style={{
                    width: "50px",
                    borderRadius: "50%"
                }}
            />

            <div className="d-flex flex-column text-truncate">
                <span className="fw-bold text-truncate">{name}</span>
                <span style={{ fontSize: "14px" }}>Painel de controle</span>
            </div>
        </div>
    )
}