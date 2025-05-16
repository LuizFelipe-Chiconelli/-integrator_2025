export interface Job {
    id: string,
    title: string,
    description: string,
    company: string,
    location: string,
    salary_from: number,
    salary_to: number,
    employment_type: string,
    application_deadline: Date,
    qualifications: string,
    contact: string
    job_category: string,
    is_remote_work: 0 | 1,
    number_of_opening: number,
    created_at: Date,
    updated_at: Date
}