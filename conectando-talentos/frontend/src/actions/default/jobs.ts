"use server"

import api from "../api"

import type { Job } from "@/types/jobs"
import type { AxiosResponse } from "axios"

export async function getJobs(filter?: string): Promise<Job[]> {
    const res: AxiosResponse<{ data: Job[] }> = await api.get<{ data: Job[] }>("/vaga/listaPublica")
    return res.data.data || []
}

export async function getSingleVacancy(id: string): Promise<Job> {
    // ID será usado na busca com a API real
    const res: AxiosResponse = await api.get(`/vaga/detalhe/${id}`)
    console.log(res)
    const data: Job = res.data

    return data
}
