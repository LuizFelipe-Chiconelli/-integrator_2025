'use client'

import { Navigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

import type { Company, SessionContextType } from "./types"

import api from "@/actions/api"
import type { CandidateApplication, Job } from "@/types/jobs"

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useCompanySessionContext = (): SessionContextType => {
    const context = useContext(SessionContext)

    if (!context) {
        throw new Error('Este hook deve ser utilizado dentro de um CompanySessionProvider!')
    }

    return context
}

interface Props {
    children: React.ReactElement | React.ReactElement[]
}

export default function CompanySessionProvider({ children }: Props) {
    const [companyInfo, setCompanyInfo] = useState<Company | null | undefined>(null)

    const fetchCompanyInfo = async () => {
        try {
            const { data }: { data: { empresa: Company } } = await api.get("/empresa/perfil")
            setCompanyInfo(data.empresa)
        } catch (error) {
            setCompanyInfo(undefined)
        }
    }

    const updateCompanyInfo = async (info: Company): Promise<{ ok: boolean, message?: string }> => {
        try {
            const payload: Company = { ...companyInfo, ...info } as Company
            await api.post("/empresa/perfil", payload)
            fetchCompanyInfo()

            return { ok: true, message: "Alterações salvas com  sucesso!" }
        } catch (error) {
            return { ok: false, message: error as string }
        }
    }

    // Vacancy

    const createJobVacancy = async (info: Job): Promise<{ ok: boolean, message?: string }> => {
        try {
            await api.post('/vaga/publicar', info)
            return { ok: true }
        } catch (error) {
            return { ok: false, message: error as string }
        }
    }

    const getJobVacancies = async (): Promise<{ ok: boolean, vacancies?: Job[] }> => {
        try {
            const { data: { data } }: { data: { data: Job[] } } = await api.get("/vaga/minhas")
            return { ok: true, vacancies: data }
        } catch (error) {
            return { ok: false }
        }
    }

    const updateVacancy = async (info: Job): Promise<{ ok: boolean, message?: string }> => {
        try {
            await api.put(`/vaga/atualizar/${info.vaga_id}`, info)
            return { ok: true }
        } catch (error) {
            return { ok: false, message: String(error) }
        }
    }

    const updateVacancyStatus = async (id: string, status: number): Promise<{ ok: boolean, message?: string }> => {
        try {
            await api.post(`/vaga/status/${id}`, { statusVaga: status })
            return { ok: true }
        } catch (error) {
            return { ok: false, message: String(error) }
        }
    }

    // Application
    const getApplicationList = async (id: number): Promise<{ ok: boolean, applications?: CandidateApplication[] }> => {
        try {
            const { data: { data } }: { data: { data: CandidateApplication[] } } = await api.get(`/candidatura/porVaga/listar/${id}`)
            console.log(data)

            return { ok: true, applications: data }
        } catch (error) {
            return { ok: false }
        }
    }

    const updateApplicationStatus = async (payload: {
        vaga_id: number
        curriculum_id: number
        statusCandidatura: number
    }): Promise<{ ok: boolean }> => {
        try {
            await api.post('/candidatura/status', payload)

            return { ok: true }
        } catch (error) {
            return { ok: false }
        }
    }

    useEffect(() => {
        fetchCompanyInfo()
    }, [])

    return (
        <SessionContext.Provider value={{
            companyInfo,
            updateCompanyInfo,
            createJobVacancy,
            getJobVacancies,
            updateVacancy,
            updateVacancyStatus,
            getApplicationList,
            updateApplicationStatus
        }}>
            {companyInfo === undefined && (<><Navigate to='/auth/login-empresa' /></>)}
            {companyInfo && (children)}
        </SessionContext.Provider>
    )
}
