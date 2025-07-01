import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaBuilding } from "react-icons/fa";
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
    </Container>
  );
}
