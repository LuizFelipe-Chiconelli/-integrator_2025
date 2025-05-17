import { Pagination, Container } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"

export default function PaginationButtons() {
    const [_, setSearchParams] = useSearchParams()

    const changePage = (page: string) => {
        setSearchParams({ page })
    }

    return (
        <Container fluid className="d-flex justify-content-center gap-1 mt-4">
            <Pagination>
                <Pagination.Item
                    onClick={() => { changePage("1") }}
                >1</Pagination.Item>
                <Pagination.Item
                    onClick={() => { changePage("2") }}
                >2</Pagination.Item>
                <Pagination.Item
                    onClick={() => { changePage("3") }}
                >3</Pagination.Item>
            </Pagination>
        </Container>
    )
}