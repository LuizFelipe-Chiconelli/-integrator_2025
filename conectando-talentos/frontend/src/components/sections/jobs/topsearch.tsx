import { Button, Container, Form } from "react-bootstrap"

// Hooks
import { useRef } from "react"
import { useSearchParams } from "react-router-dom"

// Tipos
import type { SyntheticEvent } from "react"

export default function TopSearch() {
    const [_, setSearchParams] = useSearchParams()

    const inputRef = useRef<HTMLInputElement>(null)

    // Setar parâmetros
    const setSearch = (query: string): void => {
        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)

            updatedParams.set("query", query)

            if (updatedParams.get("page")) updatedParams.delete("page")

            return updatedParams
        })
    }

    // Remover Parâmetros
    const removeSearch = (): void => {
        setSearchParams((prev: URLSearchParams) => {
            const updatedParams = new URLSearchParams(prev)
            updatedParams.delete("query")
            if (updatedParams.get("page")) updatedParams.delete("page")

            return updatedParams
        })
    }

    // Submit Event
    const handleSearch = (e: SyntheticEvent) => {
        e.preventDefault()

        // Setar ou remover query e página
        if (inputRef.current?.value) {
            setSearch(inputRef.current?.value)
        } else {
            removeSearch()
        }
    }

    return (
        <Container
            fluid
            className="bg-primary
            justify-content-center align-items-center py-5"
        >
            <div className="d-flex flex-column align-items-center">
                <h1 className="text-white fw-bold fs-3">Encontre a vaga perfeita para você!</h1>

                <Container>
                    <Form
                        onSubmit={handleSearch}
                        className="bg-white rounded-4 p-4"
                    >
                        <div className="row gap-2 justify-content-center">

                            <Form.Group className="col-lg-9 mx-0 px-0" controlId="formVaga">
                                <Form.Control
                                    ref={inputRef}
                                    type="text"
                                    size="lg"
                                    className="rounded-3 w-100 border fs-6"
                                    placeholder="Cargo, palavra-chave ou empresa"
                                />
                            </Form.Group>

                            <div className="col-lg-2 mx-0 px-0">
                                <Button
                                    id="searchButton"
                                    className="w-100 fs-6"
                                    style={{ height: "42px" }}
                                >
                                    Buscar Vagas
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Container>
            </div>
        </Container>
    )
}