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
      <Container className="my-3">
        <Row>
          <Col>
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={12}>
            <div id="welcome-container" className="d-flex align-items-center">
              <div className="text-content flex-column">
                <div className="head">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-alt">Hoşgeldin</div>
              </div>
              <div className="image-content">
                <img src="/assets/svg/welcome.svg" alt="Blank welcome image"></img>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
