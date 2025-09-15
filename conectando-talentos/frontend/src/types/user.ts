export interface UserInfoPayload {
    nome: string
    cpf: string
    logradouro: string
    bairro: string
    cep: string
    cidade_id: string
    telefone: string
    data_nascimento: string
    sexo: string
    email: string
    numero: string | number
    complemento?: string
    uf: string | number
    apresentacao: string
}

export interface UserInfo {
    pessoa_fisica: {
        pessoa_fisica_id?: string | number
        nome: string
        cpf: string
        visitante_id?: string | number | null
    }
    usuario: {
        id?: string | number
        login: string
        tipo: string
    }
    curriculum: {
        curriculum_id: string | number
        logradouro: string
        numero?: string | number | null
        complemento: string
        bairro: string
        cep: string
        cidade_id: string | number
        cidade: string
        telefone: string
        uf: string
        dataNascimento: string
        apresentacaoPessoal: string
        celular: string
        email: string
        foto?: string | null
        sexo: "M" | "F"
    }
}

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
    cargo_id: number | string
    inicio_mes: string
    inicio_ano: string
    fim_mes?: string
    fim_ano?: string
    estabelecimento: string
    cargo_descricao: string
    atividades_exercidas: string
}

export interface Qualification {
    id: number
    mes: string
    ano: string
    carga_horaria: string
    descricao: string
    estabelecimento: string
}
