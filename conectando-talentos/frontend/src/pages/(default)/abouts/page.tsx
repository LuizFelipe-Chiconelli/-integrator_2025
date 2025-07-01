import { Container, Row, Col, Card } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Banner from "@/components/sections/about/banner.tsx";
import "./abouts.css";

export default function About() {
  return (
    <>
      <Banner />

      <Container className="">
        {/* Missão */}
        <Card className="p-4 my-4 text-center shadow-sm border-0">
          <h5 className="fw-bold text-primary">Nossa Missão</h5>
          <p className="text-muted">
            Na <strong>InformJobs</strong>, acreditamos no potencial da nossa região e no talento dos profissionais locais.
            Nossa missão é facilitar o encontro entre empresas e candidatos qualificados, promovendo o crescimento regional e a inclusão.
          </p>
        </Card>

        {/* Quem Somos e Valores */}
        <Row className="gy-4">
          <Col md={6}>
            <Card className="p-4 h-100 shadow-sm border-0">
              <h5 className="fw-bold text-primary">Quem Somos</h5>
              <p className="text-muted">
                A <strong>InformJobs</strong> nasceu em 2025 com o objetivo de aproximar empresas e talentos da região.
                Com uma plataforma prática e acessível, oferecemos soluções que atendem tanto candidatos quanto empregadores.
              </p>
              <p className="text-muted">
                Unimos tecnologia e conhecimento de mercado para transformar a forma como oportunidades são criadas e encontradas.
              </p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 h-100 shadow-sm border-0">
              <h5 className="fw-bold text-primary">Nossos Valores</h5>
              <ol className="valores text-muted">
                <li><strong>Compromisso Local:</strong> promovemos o desenvolvimento econômico regional.</li>
                <li><strong>Transparência:</strong> oferecemos relações claras e honestas.</li>
                <li><strong>Inovação:</strong> buscamos sempre melhorar a experiência da plataforma.</li>
                <li><strong>Inclusão:</strong> promovemos oportunidades para todos, sem exceção.</li>
              </ol>
            </Card>
          </Col>
        </Row>

        {/* Equipe */}
        <div className="equipe-container">
          <h4 className="text-center mb-4">Nossa Equipe</h4>
          <p className="text-center text-muted">
            A <strong>InformJobs</strong> é formada por um time de sócios visionários e comprometidos com o desenvolvimento regional.
          </p>
          <p className="text-center text-muted mb-4">
            Conheça os fundadores que tornaram esta plataforma possível:
          </p>

          <Row className="justify-content-center gy-4">
            {[
              {
                nome: "Luiz Felipe",
                cargo: "Co-fundador e Desenvolvedor Back-end",
                descricao: "Responsável pela arquitetura da plataforma e integração com sistemas.",
              },
              {
                nome: "Vinicius",
                cargo: "Co-fundador e Desenvolvedor Front-end",
                descricao: "Atua na criação das interfaces modernas e intuitivas da aplicação.",
              },
              {
                nome: "Letícia",
                cargo: "Co-fundadora e UX/UI Designer",
                descricao: "Cuida da experiência do usuário e da identidade visual da InformJobs.",
              },
              {
                nome: "Matheus",
                cargo: "Co-fundador e Analista de Dados",
                descricao: "Focado em métricas, análise de desempenho e melhorias baseadas em dados.",
              },
              {
                nome: "Daniel",
                cargo: "Co-fundador e Gestor de Projetos",
                descricao: "Responsável pela organização das etapas, prazos e estratégia da plataforma.",
              },
              {
                nome: "Paulo Henrique",
                cargo: "Co-fundador e Gestor de Projetos",
                descricao: "Responsável pela organização das etapas, prazos e estratégia da plataforma.",
              },
            ].map((membro, index) => (
              <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center" key={index}>
                <Card className="p-3 h-100 equipe-card w-100" style={{ maxWidth: '270px' }}>
                  <div className="avatar-placeholder mx-auto" />
                  <h6 className="equipe-nome text-center">{membro.nome}</h6>
                  <p className="equipe-cargo text-center">{membro.cargo}</p>
                  <p className="equipe-descricao text-center">{membro.descricao}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contato */}
        <Card className="p-4 mt-5 shadow-sm border-0">
          <h5 className="fw-bold mb-3">Entre em Contato</h5>
          <Row>
            <Col md={6}>
              <p><FaEnvelope className="contact-icon" /> contato@infojobs.com.br</p>
              <p><FaPhone className="contact-icon" /> (11) 5555-5555</p>
              <p><FaMapMarkerAlt className="contact-icon" /> Av. Principal, 1000 - Centro, Cidade - Estado</p>
            </Col>
            <Col md={6}>
              <p><FaClock className="contact-icon" /> Segunda a Sexta: 9h às 18h</p>
              <p><FaClock className="contact-icon" /> Sábado: 9h às 13h</p>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
