export interface UF {
    id: number
    nome: string
    sigla: string
    regiao: {
        id: number
        nome: string
        sigla: string
    }
}

export interface NewCity {
    nome: string
    codigo_ibge: string
}

export interface City {
    id: string | number
    nome: string
    uf: string
}

export interface Role {
    cargo_id: number
    descricao: string
}