import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaBuilding, FaCheckCircle } from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import "./business.css";

export default function Business() {
  return (
    <Container className="business-page my-5">
      {/* Título e Subtítulo */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Empresas Parceiras</h2>
        <p className="text-muted fs-5">
          Conectamos empresas de todos os portes com profissionais qualificados na nossa região
        </p>
      </div>

      {/* Cards de acesso e cadastro */}
      <Row className="mb-5 g-4 justify-content-center">
        <Col md={5}>
          <Card className="h-100 p-4 shadow-sm access-card">
            <div className="d-flex align-items-start gap-3">
              <div className="icon-box bg-primary bg-opacity-10 text-primary">
                <FaBuilding size={24} />
              </div>
              <div>
                <h6 className="fw-bold">Já é uma empresa parceira?</h6>
                <p className="text-muted small mb-3">
                  Acesse sua conta para publicar vagas e gerenciar candidaturas
                </p>
                <Button variant="primary" className="w-100">Entrar</Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="h-100 p-4 shadow-sm access-card">
            <div className="d-flex align-items-start gap-3">
              <div className="icon-box bg-success bg-opacity-10 text-success">
                <BsBuildings size={24} />
              </div>
              <div>
                <h6 className="fw-bold">Nova empresa?</h6>
                <p className="text-muted small mb-3">
                  Cadastre-se gratuitamente e comece a encontrar os melhores talentos
                </p>
                <Button variant="success" className="w-100">Cadastrar Empresa</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Vantagens */}
      <div className="mb-5">
        <h4 className="fw-bold">Vantagens para Empresas</h4>
        <Row className="mt-4 g-4">
          <Col md={4}>
            <Card className="h-100 p-4 shadow-sm advantage-card">
              <div className="circle-number">1</div>
              <h6 className="fw-bold">Acesso a candidatos locais</h6>
              <p className="text-muted small">
                Encontre profissionais qualificados da nossa região, reduzindo custos com deslocamento e facilitando entrevistas presenciais.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 p-4 shadow-sm advantage-card">
              <div className="circle-number">2</div>
              <h6 className="fw-bold">Filtros avançados</h6>
              <p className="text-muted small">
                Utilize nossos filtros de busca para encontrar candidatos com as habilidades e experiência que sua empresa precisa.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 p-4 shadow-sm advantage-card">
              <div className="circle-number">3</div>
              <h6 className="fw-bold">Gestão simplificada</h6>
              <p className="text-muted small">
                Gerencie todas as suas vagas, candidaturas e entrevistas em um único lugar, com ferramentas intuitivas.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Planos */}
      <div className="p-4 bg-light rounded plan-section">
        <h4 className="text-center fw-bold text-primary">Planos para Empresas</h4>
        <p className="text-center text-muted">
          Escolha o plano mais adequado para o porte e necessidades da sua empresa
        </p>

        <Row className="mt-4 g-4 justify-content-center">
          <Col md={4}>
            <Card className="h-100 text-center p-4 shadow-sm pricing-card">
              <h6 className="fw-bold">Básico</h6>
              <h3 className="fw-bold">Grátis</h3>
              <ul className="text-start list-unstyled mt-3 text-muted small">
                <li><FaCheckCircle className="text-success me-2" />3 vagas por mês</li>
                <li><FaCheckCircle className="text-success me-2" />Filtros básicos</li>
                <li><FaCheckCircle className="text-success me-2" />30 dias de exibição</li>
              </ul>
              <Button variant="outline-primary">Começar agora</Button>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center p-4 shadow-sm border-primary border-2 pricing-card featured">
              <h6 className="fw-bold">Empresarial</h6>
              <h3 className="fw-bold">R$ 199</h3>
              <span className="text-muted">/mês</span>
              <ul className="text-start list-unstyled mt-3 text-muted small">
                <li><FaCheckCircle className="text-success me-2" />15 vagas por mês</li>
                <li><FaCheckCircle className="text-success me-2" />Filtros avançados</li>
                <li><FaCheckCircle className="text-success me-2" />60 dias de exibição</li>
                <li><FaCheckCircle className="text-success me-2" />Destaque nas buscas</li>
              </ul>
              <Button variant="primary">Escolher plano</Button>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center p-4 shadow-sm pricing-card">
              <h6 className="fw-bold">Premium</h6>
              <h3 className="fw-bold">R$ 399</h3>
              <span className="text-muted">/mês</span>
              <ul className="text-start list-unstyled mt-3 text-muted small">
                <li><FaCheckCircle className="text-success me-2" />Vagas ilimitadas</li>
                <li><FaCheckCircle className="text-success me-2" />Filtros exclusivos</li>
                <li><FaCheckCircle className="text-success me-2" />90 dias de exibição</li>
                <li><FaCheckCircle className="text-success me-2" />Destaque principal</li>
                <li><FaCheckCircle className="text-success me-2" />Suporte prioritário</li>
              </ul>
              <Button variant="outline-success">Escolher plano</Button>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
