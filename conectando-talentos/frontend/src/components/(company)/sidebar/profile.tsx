'use client'

import { useCompanySessionContext } from "@/_session/company/context"

export default function Profile() {
    const { companyInfo } = useCompanySessionContext()

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
                <span className="fw-bold text-truncate">{companyInfo?.nome}</span>
                <span style={{ fontSize: "14px" }}>Painel de controle</span>
            </div>
        </div>
    )
}