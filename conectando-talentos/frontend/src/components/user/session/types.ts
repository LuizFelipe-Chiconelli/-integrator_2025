import type { UserInfo } from "@/types/user"

export interface SessionContextType {
    userInfo: UserInfo | null
}