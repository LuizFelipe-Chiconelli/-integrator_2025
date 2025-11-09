export interface Job {
    vaga_id: number
    cargo_id: number
    titulo: string
    descricao: string
    requisitos: string
    localizacao: string
    salario_minimo: string
    salario_maximo: string
    nivel: number
    modalidade: number
    vinculo: number
    dtInicio: Date | string
    dtFim: Date | string
    estabelecimento_id: number
    statusVaga: number
    cargo_descricao: string
    empresa_id: number
    empresa_nome: string
    empresa_descricao?: string | null
    empresa_email?: string | null
    empresa_facebook?: string | null
    empresa_instagram?: string | null
    empresa_linkedin?: string | null
    empresa_setor?: string | null
    empresa_website?: string | null
}

export interface Application extends Job {
    curriculum_id: number
    statusCandidatura: number
    dataCandidatura: Date | string
}
