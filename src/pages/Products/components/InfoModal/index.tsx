import { faCopy } from "@fortawesome/free-regular-svg-icons";
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
              <FormGroup className="mb-3" controlId="infoProductModalNameInput">
                <FormLabel>Ad</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Ad" value={product.name} readOnly />
                  <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.name}>
                    <FontAwesomeIcon icon={faCopy} />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoProductModalBarcodeNumberInput">
                <FormLabel>Barkod</FormLabel>
                <InputGroup>
                  <FormControl placeholder="MB-0000000001" value={product.barcodeNumber} readOnly />
                  <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.barcodeNumber}>
                    <FontAwesomeIcon icon={faCopy} />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoProductModalModelNumberInput">
                <FormLabel>Model</FormLabel>
                <InputGroup>
                  <FormControl placeholder="MB-00001" value={product.modelNumber} readOnly />
                  <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.modelNumber}>
                    <FontAwesomeIcon icon={faCopy} />
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoProductModalUnitPriceInput">
                <FormLabel>Alış Fiyatı</FormLabel>
                <InputGroup>
                  <FormControl placeholder="Alış Fiyatı" value={product.unitPrice} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoProductModalCategoryNameInput">
                <FormLabel>Kategori</FormLabel>
                <FormControl placeholder="Kategori" value={product.categoryName} readOnly />
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
