import TopSearch from "../../../components/sections/jobs/topsearch"
import JobsGrid from "../../../components/sections/jobs/jobsgrid"

export default function Jobs() {
    return (
        <main className="d-flex flex-column align-items-center">
            <TopSearch />
            <JobsGrid />
        </main>
    )
}