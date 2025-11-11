'use client'

import { Pagination, Container } from "react-bootstrap"

import { useSearchParams } from "react-router-dom"

interface Props {
    maxPages: number
}

export default function PaginationButtons({ maxPages }: Props) {
    const [_, setSearchParams] = useSearchParams()

    const pages: Array<number> = []

    const changePage = (page: string): void => {
        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)
            updatedParams.set("page", page)

            return updatedParams
        })
    }

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
                        onClick={() => { changePage(String(p)) }}
                    >{p}</Pagination.Item>
                ))}
            </Pagination>
        </Container>
    )
}