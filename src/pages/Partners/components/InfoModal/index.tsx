import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import GetByIdPartnerResponse from "../../../../http/partners/models/queries/getById/getByIdPartnerResponse";

export default function index({ partner }: Props) {
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const modalButtons: ButtonProps[] = [
    {
      key: "ok",
      variant: "primary",
      text: "Tamam",
      disabled: false,
      loading: false,
      handleClick: handleClose,
      icon: faCircleCheck,
    },
  ];

  return (
    <>
      <Button className="btn-sm ms-1" variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
      <CustomModal closable handleClose={handleClose} show={show} title="Partner Detayı" buttons={modalButtons}>
        <Container>
          <Row>
            <Col md={12}>
              <FormGroup className="mb-3" controlId="infoPartnerModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={partner.name} readOnly />
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </CustomModal>
    </>
  );
}

interface Props {
  partner: GetByIdPartnerResponse;
}
