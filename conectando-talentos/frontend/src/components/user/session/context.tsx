import { createContext, useContext, useState, useEffect } from "react"

import type { Experience, Scholarity, UserInfo, UserInfoPayload } from "@/types/user"
import type { SessionContextType } from "./types"
import type { AxiosResponse } from "axios"

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
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    const fetchUserInfo = async () => {
        const { data }: { data: UserInfo } = await api.get("/usuario/perfil")
        setUserInfo(data)
    }

    const updateUserInfo = async (info: UserInfoPayload): Promise<void> => {
        await api.post("/usuario/perfil", info)
        fetchUserInfo()
    }

    const fetchScholarity = async (userId: string | number): Promise<Scholarity[]> => {
        const res: AxiosResponse<{ data: Scholarity[] }> = await api.get<{ data: Scholarity[] }>(`/escolaridade/lista/${userId}`)
        return res.data.data
    }

    const saveScholarity = async (info: Scholarity): Promise<void> => {
        if (!info.curriculum_escolaridade_id) {
            await api.post('/escolaridade/criar', info)
        } else {
            await api.post(`/escolaridade/atualizar/${userInfo?.usuario.id}`, info)
        }
    }

    const deleteScholarity = async (id: number): Promise<void> => {
        await api.delete(`/escolaridade/remover/${id}`)
    }

    const fetchExperience = async (userId: string | number): Promise<Experience[]> => {
        const res: AxiosResponse<{ data: Experience[] }> = await api.get<{ data: Experience[] }>(`/experiencia/lista/${userId}`)
        return res.data.data
    }

    const saveExperience = async (info: Experience): Promise<void> => {
        if (!info.curriculum_experiencia_id) {
            await api.post('/experiencia/criar', info)
        } else {
            await api.post(`/experiencia/atualizar/${userInfo?.usuario.id}`, info)
        }
    }

    const deleteExperience = async (id: number): Promise<void> => {
        const res = await api.delete(`/experiencia/excluir/${id}`)
        console.log(res)
    }

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
            deleteExperience
        }}>
            {children}
        </SessionContext.Provider>
    )
}
