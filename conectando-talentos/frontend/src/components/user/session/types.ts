import type { UserInfo, UserInfoPayload } from "@/types/user"

export interface SessionContextType {
    userInfo: UserInfo | null
    updateUserInfo: (info: UserInfoPayload) => Promise<void>
}