'use client'

import { Pagination, Container } from "react-bootstrap"

interface Props {
    page: number
    maxPages: number
    setPage: (val: number) => void
}

export default function PaginationButtons({ page, maxPages, setPage }: Props) {
    const pages: Array<number> = []

    const genButtons = () => {
        for (let i = 1; i <= maxPages; i++) {
            pages.push(i)
        }
    }

    genButtons()

    return (
        <Container fluid className="d-flex justify-content-center gap-1 mt-4">
            <Pagination>
                {pages.map(p => (
                    <Pagination.Item
                        key={p}
                        onClick={() => { setPage(p) }}
                    >{p}</Pagination.Item>
                ))}
            </Pagination>
        </Container>
    )
}