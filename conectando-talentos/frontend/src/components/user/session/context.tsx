import { createContext, useContext, useState, useEffect } from "react"

import type { UserInfo, UserInfoPayload } from "@/types/user"
import type { SessionContextType } from "./types"

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

    const updateUserInfo = async (info: UserInfoPayload): Promise<UserInfoPayload> => {
        const res = await api.post("/usuario/perfil", info)
        console.log(res.data)
        return res.data
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    return (
        <SessionContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </SessionContext.Provider>
    )
}
