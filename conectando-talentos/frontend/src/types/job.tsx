export interface JobOffer {
    imageURL: string,
    city: string,
    uf: string,
    enterprise: {
        name: string
    },
    role: {
        name: string,
        salary: string,
        workhours: string
    }
    skills: string[],
    createdAt: Date
}