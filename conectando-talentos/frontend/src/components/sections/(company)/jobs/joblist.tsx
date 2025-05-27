import { Container } from "react-bootstrap"

import List from "../../../company/jobs/list"
import JobFilters from "../../../company/jobs/filter"
import PaginationButtons from "../../../all/pagination"

export default function JobList() {
    return (
        <Container fluid className="mt-3 p-0">
            <JobFilters />
            <List />
            <PaginationButtons />
        </Container>
    )
}