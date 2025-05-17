import { Link } from 'react-router-dom'
import { Container, Nav } from 'react-bootstrap'

import { FaXTwitter, FaSquareFacebook } from "react-icons/fa6"
import { FaInfoCircle, FaLinkedin, FaInstagram } from "react-icons/fa"

import './footer.css'

export default function Footer() {
    return (
        <footer className='d-flex flex-column align-items-center justify-content-center py-5 mt-5 border-top'>
            <Container className='d-flex justify-content-center row row-cols-1 row-cols-sm-2 row-cols-md-5'>
                <div className="col mb-3">
                    <Link to='/' className='d-flex align-items-center text-black text-decoration-none gap-2'>
                        <FaInfoCircle id='logo' /> <span className='fw-bold fs-3'>InfoJobs</span>
                    </Link>

                    <div className='d-flex fs-4 gap-4 mt-2'>
                        <Link to='#' className='text-black'>
                            <FaSquareFacebook />
                        </Link>
                        <Link to='#' className='text-black'>
                            <FaLinkedin />
                        </Link>
                        <Link to='#' className='text-black'>
                            <FaInstagram />
                        </Link>
                        <Link to='#' className='text-black'>
                            <FaXTwitter />
                        </Link>
                    </div>
                </div>

                <div className="col mb-3">
                </div>

                <div className="col mb-3">
                    <h5>Sobre a InfoJobs</h5>
                    <Nav className='d-flex flex-column'>
                        <Nav.Link as={Link} to="/">Saiba mais</Nav.Link>
                        <Nav.Link as={Link} to="#">Trabalhe conosco</Nav.Link>
                        <Nav.Link as={Link} to="#">Privacidade</Nav.Link>
                        <Nav.Link as={Link} to="#">LGPD</Nav.Link>
                    </Nav>
                </div>

                <div className="col mb-3">
                    <h5>Contato e Ajuda</h5>
                    <Nav className='d-flex flex-column'>
                        <Nav.Link as={Link} to="/">Telefone</Nav.Link>
                        <Nav.Link as={Link} to="#">Whatsapp</Nav.Link>
                        <Nav.Link as={Link} to="#">Parcerias</Nav.Link>
                        <Nav.Link as={Link} to="#">Suporte</Nav.Link>
                    </Nav>
                </div>

                <div className="col mb-3">
                    <h5>Para Candidatura</h5>
                    <Nav className='d-flex flex-column'>
                        <Nav.Link as={Link} to="/">Vagas</Nav.Link>
                        <Nav.Link as={Link} to="#">Suporte</Nav.Link>
                        <Nav.Link as={Link} to="#">Novidades</Nav.Link>
                        <Nav.Link as={Link} to="#">Cursos</Nav.Link>
                    </Nav>
                </div>

            </Container>

            <Container className='text-center border-top pt-5'>
                <span className="text-body-secondary">© 2025 InfoJobs. Todos os direitos reservados.</span>
            </Container>
        </footer>
    )
}