import type { Experience, Scholarity, UserInfo, UserInfoPayload } from "@/types/user"

export interface SessionContextType {
    userInfo: UserInfo | null
    updateUserInfo: (info: UserInfoPayload) => Promise<void>
    fetchScholarity: (userId: string | number) => Promise<Scholarity[]>
    saveScholarity: (info: Scholarity) => Promise<void>
    deleteScholarity: (id: number) => Promise<void>
    fetchExperience: (userId: string | number) => Promise<Experience[]>
    saveExperience: (info: Experience) => Promise<void>
    deleteExperience: (id: number) => Promise<void>
}