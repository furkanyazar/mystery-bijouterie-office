import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import GetByIdMaterialResponse from "../../../../http/materials/models/queries/getById/getByIdMaterialResponse";

export default function index({ material }: Props) {
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
      <MBModal
        id={`infoMaterialModal-${material.id}`}
        closable
        handleClose={handleClose}
        show={show}
        title="Materyal Detayı"
        buttons={modalButtons}
      >
        <Container>
          <Row>
            <Col md={12}>
              <FormGroup className="mb-3" controlId="infoMaterialModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={material.name} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoMaterialModalPurchasePriceInput">
                <FormLabel>Alış Fiyatı</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Alış Fiyatı" value={material.purchasePrice} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoMaterialModalUnitsInStockInput">
                <FormLabel>Stok Miktarı</FormLabel>
                <FormControl placeholder="Stok Miktarı" value={material.unitsInStock} readOnly />
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </MBModal>
    </>
  );
}

interface Props {
  material: GetByIdMaterialResponse;
}
