import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";

export default function index() {
  const { code } = useParams();

  const pageTitle = `Hata ${code}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-3">
        <Row>
          <Col>
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
        </Row>
        <hr />
        <Row className="my-5">
          <Col>
            <strong className="d-block text-center">
              {code === "404" ? "Aradığınız sayfa bulunamadı!" : "Beklenmedik bir hata oluştu!"}
            </strong>
          </Col>
        </Row>
      </Container>
    </>
  );
}
