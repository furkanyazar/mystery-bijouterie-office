import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";

export default function index() {
  const pageTitle = "Yan Ürünler";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          <Col className="col-6">
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
          <Col className="col-6 text-end">
            <Button variant="success" size="sm">
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        <hr className="mb-5" />
        <Row>
          <Col>
            <strong className="d-block text-center">index</strong>
          </Col>
        </Row>
      </Container>
    </>
  );
}
