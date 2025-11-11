'use server'

import axios from "axios"

export async function fetchUF() {
    const { data } = await axios.get('https://brasilapi.com.br/api/ibge/uf/v1')
    return data
}

export async function fetchCitiesByUF(uf: string) {
    const { data } = await axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=gov`)
    return data
}
