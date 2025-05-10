import { Button, Container, Nav, Navbar, NavbarCollapse } from "react-bootstrap"

import { Link } from "react-router-dom"
import { FaInfoCircle } from "react-icons/fa"

import "./header.css"

export default function Header() {
    return (
        <header className="border-bottom">
            <Navbar expand='lg'>
                <Container>

                    <div className="col-3">
                        <Navbar.Brand className="d-flex align-items-center gap-2">
                            <FaInfoCircle /> InfoJobs
                        </Navbar.Brand>
                    </div>

                    <div className="col-auto">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <NavbarCollapse>
                            <Nav id="nav">
                                <Nav.Link as={Link} to="/">Início</Nav.Link>
                                <Nav.Link as={Link} to="#">Sobre nós</Nav.Link>
                                <Nav.Link as={Link} to="#">Contato</Nav.Link>
                                <Nav.Link as={Link} to="#">Empresas</Nav.Link>
                                <Nav.Link as={Link} to="#">Vagas em destaque</Nav.Link>
                            </Nav>
                        </NavbarCollapse>
                    </div>

                    <div className="col-3 d-flex align-items-center gap-2">
                        <Button
                            id="login-btn"
                            className="bg-transparent text-primary"
                        >
                            Conecte-se
                        </Button>
                        <Button>Inscreva-se</Button>
                    </div>

                </Container>
            </Navbar>
        </header>
    )
}