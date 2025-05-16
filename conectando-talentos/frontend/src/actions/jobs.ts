"use server"

import type { Job } from "../types/job"
import axios, { type AxiosResponse } from "axios"

export async function getJobs(page: string): Promise<Array<Job>> {
    const res: AxiosResponse = await axios.get(`https://jsonfakery.com/jobs/paginated?page=${page}`)
    const data: Array<Job> = res.data.data ?? []

    return data
}