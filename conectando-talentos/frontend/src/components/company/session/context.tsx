import { createContext, useContext, useState, useEffect } from "react"

import type { SessionContextType } from "./types"
import type { CompanyInfo } from "@/types/company"

import api from "@/services/api"

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
    children: React.ReactNode[] | React.ReactNode
}

export const useSessionContext = () => {
    const context = useContext(SessionContext)

    if (!context) {
        throw new Error("useSessionContext deve ser usado dentro de um SessionProvider")
    }

    return context
}

export default function SessionProvider({ children }: Props) {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)

    const fetchCompanyInfo = async () => {
        const { data }: { data: { empresa: CompanyInfo } } = await api.get("/empresa/perfil")
        setCompanyInfo(data.empresa)
    }

    const updateCompanyInfo = async (info: CompanyInfo): Promise<void> => {
        const payload: CompanyInfo = { ...companyInfo, ...info } as CompanyInfo
        await api.post("/empresa/perfil", payload)
        fetchCompanyInfo()
    }

    useEffect(() => {
        fetchCompanyInfo()
    }, [])

    return (
        <SessionContext.Provider value={{ companyInfo, updateCompanyInfo }}>
            {children}
        </SessionContext.Provider>
    )
}
