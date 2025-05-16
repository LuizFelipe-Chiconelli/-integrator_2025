
import { Container } from "react-bootstrap"
import JobCard from "../../jobs/jobcard"

// Hooks
import { useEffect, useState } from "react"

import type { Job } from "../../../types/job"
import { getJobs } from "../../../actions/jobs"

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState<Array<Job> | null>(null)

    async function fetchJobs() {
        const res = await getJobs('1')
        setJobs(res.slice(0, 6))
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    return (
        <Container id="featured-job-Jobs" className="mt-5">
            <div className="text-center">
                <h2>Vagas em Destaque</h2>
            </div>

            <div className="row mt-5 row-gap-4">
                {jobs && jobs.map(job => {
                    return (
                        <div className="col-lg-4">
                            <JobCard job={job} />
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}