import { Container, Nav, Navbar, NavbarCollapse, Dropdown } from "react-bootstrap"

import { Link } from "react-router-dom"
import { FaInfoCircle } from "react-icons/fa"
import { RxHamburgerMenu } from "react-icons/rx"

import "./header.css"

export default function Header() {
    return (
        <header className="border-bottom">
            <Navbar expand='lg'>
                <Container>

                    <div className="col-3">
                        <Navbar.Brand className="d-flex align-items-center fw-bold gap-2">
                            <FaInfoCircle /> InformJobs
                        </Navbar.Brand>
                    </div>

                    <div className="col-auto">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <NavbarCollapse>
                            <Navbar.Offcanvas placement="end" className="p-5 p-lg-0">
                                <Nav id="nav">
                                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/vagas">Vagas</Nav.Link>
                                    <Nav.Link as={Link} to="/empresa">Empresas</Nav.Link>
                                    <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>

                                    <div className="d-flex flex-column d-lg-none align-items-start gap-2 mt-3">
                                        <Nav.Link as={Link} to="/auth/usuario">Área do Candidato</Nav.Link>
                                        <Nav.Link as={Link} to="/auth/minha-empresa">Área da Empresa</Nav.Link>
                                    </div>
                                </Nav>
                            </Navbar.Offcanvas>
                        </NavbarCollapse>
                    </div>

                    {/* Botões para desktop */}
                    <div className="col-3 d-none d-lg-flex justify-content-end align-items-center gap-2">
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-primary">Sua área</Dropdown.Toggle>
                            <Dropdown.Menu style={{ transform: 'translateX(-40%)' }}>
                                <Dropdown.Item as={Link} to="/usuario">Área do Candidato</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/minha-empresa">Área da Empresa</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                </Container>
            </Navbar>
        </header>
    )
}