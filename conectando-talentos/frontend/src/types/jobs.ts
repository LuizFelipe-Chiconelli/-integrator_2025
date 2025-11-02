export interface Job {
    vaga_id: number
    cargo_id: number
    titulo: string
    descricao: string
    requisitos: string
    localizacao: string
    salario_minimo: string,
    salario_maximo: string,
    nivel: number
    modalidade: number
    vinculo: number
    dtInicio: Date | string
    dtFim: Date | string
    estabelecimento_id: number
    statusVaga: number
    cargo_descricao: string
}