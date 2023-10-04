import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../hooks/useAppSelector";

export default function index() {
  const { user } = useAppSelector((c) => c.userItems);

  const pageTitle = "Ana Sayfa";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          <Col>
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
        </Row>
        <hr className="mb-5" />
        <Row>
          <Col>
            <strong className="d-block text-center">
              Hoş geldin {user?.firstName} {user?.lastName}!
            </strong>
          </Col>
        </Row>
      </Container>
    </>
  );
}
