import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function index() {
  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Link to={"/"}>
          <Navbar.Brand>
            <img src="/assets/img/logo128.png" width={30} height={30} className="d-inline-block align-top" /> Mystery Bijouterie
          </Navbar.Brand>
        </Link>
        <Navbar.Text>Tüm hakları saklıdır | Mystery Bijouterie © 2023</Navbar.Text>
      </Container>
    </Navbar>
  );
}
