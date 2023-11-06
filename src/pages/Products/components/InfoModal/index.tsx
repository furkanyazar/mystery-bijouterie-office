import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import GetByIdProductResponse from "../../../../http/products/models/responses/getByIdProductResponse";

export default function index({ product }: Props) {
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
      <CustomModal closable handleClose={handleClose} show={show} title="Ürün Detayı" buttons={modalButtons}>
        <Container>
          <Row>
            <Col md={12}>
              <FormGroup className="mb-3" controlId="addProductModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={product.name} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="addProductModalBarcodeNumberInput">
                <FormLabel>Barkod</FormLabel>
                <FormControl placeholder="MB-0000000001" value={product.barcodeNumber} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="addProductModalUnitPriceInput">
                <FormLabel>Alış Fiyatı</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Alış Fiyatı" value={product.unitPrice} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </CustomModal>
    </>
  );
}

interface Props {
  product: GetByIdProductResponse;
}
