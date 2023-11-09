import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
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
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalShippingCostInput">
                <FormLabel>Kargo Ücreti</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Kargo Ücreti" value={partner.shippingCost} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalFreeShippingLowerLimitSInput">
                <FormLabel>Ücretsiz Kargo Alt Limiti</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Ücretsiz Kargo Alt Limiti" value={partner.freeShippingLowerLimit} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="mb-3" controlId="infoPartnerModalHasFreeShippingSInput">
                <FormCheck type="switch" label="Ücretsiz Kargo Alt Limiti" checked={partner.hasFreeShipping} readOnly />
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
