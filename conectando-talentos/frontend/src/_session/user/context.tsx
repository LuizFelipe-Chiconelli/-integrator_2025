'use client'

import { createContext, useContext, useEffect, useState } from "react"

import type { AxiosResponse } from "axios"
import type { Experience, Qualification, Scholarity, SessionContextType, User, UserInfoPayload } from "./types"

import api from "@/actions/api"
import { Navigate } from "react-router-dom"

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useUserSessionContext = (): SessionContextType => {
    const context = useContext(SessionContext)

    if (!context) {
        throw new Error('Este hook deve ser utilizado dentro de um UserSessionProvider!')
    }

    return context
}

interface Props {
    children: React.ReactElement | React.ReactElement[]
}

export default function UserSessionProvider({ children }: Props) {
    const [userInfo, setUserInfo] = useState<User | undefined | null>(null)

    // User
    const fetchUserInfo = async () => {
        try {
            const res: AxiosResponse<User> = await api.get("/usuario/perfil")
            setUserInfo(res.data)
        } catch (error) {
            setUserInfo(undefined)
        }
    }

    const updateUserInfo = async (info: UserInfoPayload): Promise<{ ok: boolean, message?: string }> => {
        try {
            await api.post("/usuario/perfil", info)
            fetchUserInfo()

            return { ok: true }
        } catch (err) {
            return { ok: false }
        }
    }

    // Scholarity
    const fetchScholarity = async (userId: string | number): Promise<Scholarity[]> => {
        const res: AxiosResponse<{ data: Scholarity[] }> = await api.get<{ data: Scholarity[] }>(`/escolaridade/lista/${userId}`)
        return res.data.data
    }

    const saveScholarity = async (info: Scholarity): Promise<void> => {
        if (!info.curriculum_escolaridade_id) {
            await api.post('/escolaridade/criar', info)
        } else {
            await api.put(`/escolaridade/atualizar/${info.curriculum_escolaridade_id}`, info)
        }
    }

    const deleteScholarity = async (id: number): Promise<void> => {
        await api.delete(`/escolaridade/remover/${id}`)
    }

    // Experience
    const fetchExperience = async (userId: string | number): Promise<Experience[]> => {
        const res: AxiosResponse<{ data: Experience[] }> = await api.get<{ data: Experience[] }>(`/experiencia/lista/${userId}`)
        return res.data.data
    }

    const saveExperience = async (info: Experience): Promise<void> => {
        if (!info.curriculum_experiencia_id) {
            await api.post('/experiencia/criar', info)
        } else {
            await api.put(`/experiencia/atualizar/${info.curriculum_experiencia_id}`, info)
        }
    }

    const deleteExperience = async (id: number): Promise<void> => {
        await api.delete(`/experiencia/excluir/${id}`)
    }

    // Qualification
    const fetchQualification = async (userId: string | number): Promise<Qualification[]> => {
        const res: AxiosResponse<{ data: Qualification[] }> = await api.get<{ data: Qualification[] }>(`/qualificacao/lista/${userId}`)
        return res.data.data
    }

    const saveQualification = async (info: Qualification): Promise<void> => {
        if (!info.curriculum_qualificacao_id) {
            await api.post('/qualificacao/criar', info)
        } else {
            await api.put(`/qualificacao/atualizar/${info.curriculum_qualificacao_id}`, info)
        }
    }

    const deleteQualification = async (id: number): Promise<void> => {
        await api.delete(`/qualificacao/excluir/${id}`)
    }

    // Fetch
    useEffect(() => {
        fetchUserInfo()
    }, [])

    return (
        <SessionContext.Provider value={{
            userInfo,
            updateUserInfo,
            fetchScholarity,
            saveScholarity,
            deleteScholarity,
            fetchExperience,
            saveExperience,
            deleteExperience,
            fetchQualification,
            saveQualification,
            deleteQualification
        }}>
            {userInfo !== undefined ? (children) : (<><Navigate to='/' /></>)}
        </SessionContext.Provider>
    )
}
