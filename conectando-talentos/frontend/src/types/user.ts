export interface Scholarity {
    id: number
    grau: string
    descricao: string
    instituicao: string
    cidade_id: string
    inicio_mes: string
    inicio_ano: string
    fim_mes: string
    fim_ano: string
}

export interface Experience {
    id: number
    inicio_mes: string
    inicio_ano: string
    fim_mes?: string
    fim_ano?: string
    estabelecimento: string
    cargo_descricao: string
    atividades_exercidas: string
}
