import { Container } from "react-bootstrap"

import List from "@/components/company/jobs/list"
import JobFilters from "@/components/company/jobs/filter"
import PaginationButtons from "@/components/all/pagination"

export default function JobList() {
    return (
        <Container fluid className="mt-3 p-0">
            <JobFilters />
            <List />
            <PaginationButtons />
        </Container>
    )
}