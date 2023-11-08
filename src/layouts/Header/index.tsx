import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { hideNotification, setButtonDisabled, setButtonLoading, showNotification } from "../../store/slices/notificationSlice";
import auth from "../../http/auth";
import { setUser } from "../../store/slices/userSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const pathName = useLocation();

  const { user } = useAppSelector((c) => c.userItems);

  const handleClickLogout = () => {
    const cancelButtonKey = "cancel";
    const okButtonKey = "ok";
    dispatch(
      showNotification({
        show: true,
        title: "Çıkış Yapılıyor",
        closable: true,
        description: "Çıkış yapmak istediğinize emin misiniz?",
        buttons: [
          {
            key: cancelButtonKey,
            text: "Vazgeç",
            handleClick: () => dispatch(hideNotification()),
            variant: "secondary",
            disabled: false,
            loading: false,
            icon: faXmark,
          },
          {
            key: okButtonKey,
            text: "Çıkış Yap",
            handleClick: async () => {
              dispatch(setButtonDisabled(cancelButtonKey));
              dispatch(setButtonLoading(okButtonKey));
              await auth
                .revokeToken()
                .then((response) => {})
                .catch((errorResponse) => {})
                .finally(() => {
                  dispatch(setUser());
                  dispatch(hideNotification());
                });
            },
            variant: "danger",
            disabled: false,
            loading: false,
            icon: faRightFromBracket,
          },
        ],
      })
    );
  };

  return (
    <Navbar className="bg-body-tertiary" expand="lg" sticky="top">
      <Container>
        <Link to={"/"}>
          <Navbar.Brand>
            <img src="/assets/img/logo128.png" width={30} height={30} className="d-inline-block align-top" /> Mystery Bijouterie
          </Navbar.Brand>
        </Link>
        {user ? (
          <>
            <Navbar.Toggle aria-controls="navbarScrollHeader" />
            <Navbar.Collapse id="navbarScrollHeader">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Link to={"/partnerler"}>
                  <Nav.Link as={"span"} active={pathName.pathname === "/partnerler"}>
                    Partnerler
                  </Nav.Link>
                </Link>
                <Link to={"/kategoriler"}>
                  <Nav.Link as={"span"} active={pathName.pathname === "/kategoriler"}>
                    Kategoriler
                  </Nav.Link>
                </Link>
                <Link to={"/urunler"}>
                  <Nav.Link as={"span"} active={pathName.pathname === "/urunler"}>
                    Ürünler
                  </Nav.Link>
                </Link>
              </Nav>
              <Navbar.Text>Yönetim Paneli</Navbar.Text>
              <Button variant="danger" className="ms-3" onClick={handleClickLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="me-1" />
                Çıkış Yap
              </Button>
            </Navbar.Collapse>
          </>
        ) : (
          <Navbar.Text>Yönetim Paneli</Navbar.Text>
        )}
      </Container>
    </Navbar>
  );
}
