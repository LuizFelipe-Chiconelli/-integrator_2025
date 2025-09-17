import type { CompanyInfo } from "@/types/company"

export interface SessionContextType {
    companyInfo: CompanyInfo | null
    updateCompanyInfo: (info: CompanyInfo) => Promise<void>
}