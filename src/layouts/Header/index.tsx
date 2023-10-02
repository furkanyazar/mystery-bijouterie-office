import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Navbar className="bg-body-tertiary" sticky="top">
      <Container>
        <Link to={"/"}>
          <Navbar.Brand>
            <img src="/assets/img/logo128.png" width={30} height={30} className="d-inline-block align-top" /> Mystery Bijouterie
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
            <Link to={"/"}>
              <Nav.Link as={"span"} active={location.pathname === "/"}>
                Ana Sayfa
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Text>Yönetim Paneli</Navbar.Text>
      </Container>
    </Navbar>
  );
}
