import { Container, Nav, Navbar, NavbarCollapse } from "react-bootstrap"
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
                            <Navbar.Offcanvas placement="end" className="p-5 p-lg-0">
                                <Nav id="nav">
                                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/vagas">Vagas</Nav.Link>
                                    <Nav.Link as={Link} to="/empresa">Empresas</Nav.Link>
                                    <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
                                </Nav>

                                {/* Botões para mobile */}
                                <div className="d-flex flex-column d-lg-none align-items-start gap-2 mt-3">
                                    <Link
                                        to="/login"
                                        className="btn bg-transparent text-primary"
                                        id="login-btn"
                                    >
                                        Conecte-se
                                    </Link>
                                    <Link to="/register" className="btn btn-primary">
                                        Inscreva-se
                                    </Link>
                                </div>
                            </Navbar.Offcanvas>
                        </NavbarCollapse>
                    </div>

                    {/* Botões para desktop */}
                    <div className="col-3 d-none d-lg-flex align-items-center gap-2">
                        <Link
                            to="/login"
                            className="btn bg-transparent text-primary"
                            id="login-btn"
                        >
                            Conecte-se
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Inscreva-se
                        </Link>
                    </div>

                </Container>
            </Navbar>
        </header>
    )
}
