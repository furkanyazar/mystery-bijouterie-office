import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import GetByIdDiscountResponse from "../../../../http/discounts/models/queries/getById/getByIdDiscountResponse";
import { DiscountType } from "../../../../jsons/models/DiscountType";

export default function index({ discount }: Props) {
  const discountTypes: DiscountType[] = require("../../../../jsons/discountTypes.json");

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
        id={`infoDiscountModal-${discount.id}`}
        closable
        handleClose={handleClose}
        show={show}
        title="Materyal Detayı"
        buttons={modalButtons}
      >
        <Container>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={discount.name} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalPartnerNameInput">
                <FormLabel>Partner</FormLabel>
                <FormControl placeholder="Partner" value={discount.partnerName} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalPriorityInput">
                <FormLabel>Öncelik Sırası</FormLabel>
                <FormControl placeholder="Öncelik Sırası" value={discount.priority} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalDiscountTypeInput">
                <FormLabel>İndirim Tipi</FormLabel>
                <FormControl
                  placeholder="İndirim Tipi"
                  value={discountTypes.find((c) => c.id === discount.discountType)?.name ?? ""}
                  readOnly
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalDiscountLowerLimitInput">
                <FormLabel>İndirim Alt Limiti</FormLabel>
                <FormControl placeholder="İndirim Alt Limiti" value={discount.discountLowerLimit} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoDiscountModalDiscountAmountInput">
                <FormLabel>{discount.discountType === 1 ? "İndirim Yüzdesi" : "İndirim Tutarı"}</FormLabel>
                <InputGroup>
                  <FormControl
                    placeholder={discount.discountType === 1 ? "İndirim Yüzdesi" : "İndirim Tutarı"}
                    value={discount.discountAmount}
                    readOnly
                  />
                  <InputGroup.Text>{discount.discountType == 1 ? "%" : "₺"}</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </MBModal>
    </>
  );
}

interface Props {
  discount: GetByIdDiscountResponse;
}
