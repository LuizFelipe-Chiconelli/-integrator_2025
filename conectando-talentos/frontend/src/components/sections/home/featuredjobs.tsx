
import { Container } from "react-bootstrap"

import JobCard from "../../jobs/jobcard"
import CardPlaceholder from "../../jobs/cardplaceholder"

// Hooks
import { useEffect, useState } from "react"

// Actions
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
                {jobs && jobs.map((job, index) => {
                    return (
                        <div className="col-lg-4" key={index}>
                            <JobCard job={job} />
                        </div>
                    )
                })}

                {/* Placeholders */}
                {!jobs && (
                    <>
                        <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                        <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                        <div className="col-lg-4 px-1"><CardPlaceholder /></div>
                    </>
                )}
            </div>
        </Container>
    )
}