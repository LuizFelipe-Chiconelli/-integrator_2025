import { Button } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"

export default function ProfileTabs() {
    const [searchParams, setSearchParams] = useSearchParams()
    const tab: string | null = searchParams.get("tab")

    const changeTab = (tab: string): void => {
        setSearchParams({ tab })
    }

    return (
        <div className="row bg-light rounded-2">
            <Button
                variant="light"
                className={`col-md-4 ${!tab || tab === "info" ? "active" : ""}`}
                onClick={() => { changeTab("info") }}
            >
                Informações da Empresa
            </Button>

            <Button
                variant="light"
                className={`col-md-4 ${tab === "account" ? "active" : ""}`}
                onClick={() => { changeTab("account") }}
            >
                Conta
            </Button>

            <Button
                variant="light"
                className={`col-md-4 ${tab === "social" ? "active" : ""}`}
                onClick={() => { changeTab("social") }}
            >
                Redes Sociais
            </Button>
        </div>
    )
}