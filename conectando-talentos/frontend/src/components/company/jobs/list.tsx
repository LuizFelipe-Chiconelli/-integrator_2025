import JobCard from "./card"

export default function List() {
    return (
        <div className="w-100 d-flex flex-column gap-3">
            <JobCard />
            <JobCard />
            <JobCard />
            <JobCard />
        </div>
    )
}