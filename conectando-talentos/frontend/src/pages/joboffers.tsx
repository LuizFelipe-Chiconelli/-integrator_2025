import TopSearch from "../components/sections/joboffers/topsearch"
import JobOffersGrid from "../components/sections/joboffers/joboffersgrid"

export default function JobOffers() {
    return (
        <main className="d-flex flex-column align-items-center">
            <TopSearch />
            <JobOffersGrid />
        </main>
    )
}