import type { CandidateApplication, Job } from "@/types/jobs"

export interface SessionContextType {
    companyInfo: Company | null | undefined
    updateCompanyInfo: (info: Company) => Promise<{ ok: boolean, message?: string }>
    createJobVacancy: (info: Job) => Promise<{ ok: boolean, message?: string }>
    getJobVacancies: () => Promise<{ ok: boolean, vacancies?: Job[] }>
    updateVacancy: (info: Job) => Promise<{ ok: boolean, message?: string }>
    updateVacancyStatus: (id: string, status: number) => Promise<{ ok: boolean, message?: string }>,
    getApplicationList: (id: number) => Promise<{ ok: boolean, applications?: CandidateApplication[] }>
}

export interface Company {
    estabelecimento_id?: number
    nome: string,
    cnpj: string,
    email: string,
    setor?: string,
    endereco: string,
    latitude?: string,
    longitude?: string,
    descricao?: string,
    website?: string,
    linkedin?: string,
    instagram?: string,
    facebook?: string
}
