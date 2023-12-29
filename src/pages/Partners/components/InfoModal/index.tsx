import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
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
      <MBModal
        id={`infoPartnerModal-${partner.id}`}
        size="lg"
        closable
        handleClose={handleClose}
        show={show}
        title="Partner Detayı"
        buttons={modalButtons}
      >
        <Container>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={partner.name} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalShippingCostInput">
                <FormLabel>Kargo Ücreti</FormLabel>
                <InputGroup>
                  <InputGroup.Text>
                    <FormCheck
                      type="switch"
                      label="KDV Dahil"
                      id="addPartnerModalHasTaxShippingCoast"
                      checked={partner.hasTaxShippingCost}
                      readOnly
                    />
                  </InputGroup.Text>
                  <FormControl placeholder="Kargo Ücreti" value={partner.shippingCost} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalServiceFeeLimitSInput">
                <FormLabel>Hizmet Bedeli</FormLabel>
                <InputGroup>
                  <InputGroup.Text>
                    <FormCheck
                      type="switch"
                      label="KDV Dahil"
                      id="addPartnerModalHasTaxServiceFee"
                      checked={partner.hasTaxServiceFee}
                      readOnly
                    />
                  </InputGroup.Text>
                  <FormControl placeholder="Hizmet Bedeli" value={partner.serviceFee} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalTransactionFeeLimitSInput">
                <FormLabel>İşlem Ücreti</FormLabel>
                <InputGroup>
                  <InputGroup.Text>
                    <FormCheck
                      type="switch"
                      label="KDV Dahil"
                      id="addPartnerModalHasTaxTransactionFee"
                      checked={partner.hasTaxTransactionFee}
                      readOnly
                    />
                  </InputGroup.Text>
                  <FormControl placeholder="İşlem Ücreti" value={partner.transactionFee} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalHasTaxCommissionsInput">
                <FormCheck type="switch" label="Komisyonlara KDV Dahil" checked={partner.hasTaxCommissions} readOnly />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3" controlId="infoPartnerModalHasShippingScaleInput">
                <FormCheck type="switch" label="Kargo Barem Uygulaması" checked={partner.hasShippingScale} readOnly />
              </FormGroup>
            </Col>
            {partner.hasShippingScale && (
              <>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalFirstScaleLowerLimitInput">
                    <FormLabel>1. Barem Alt Limit</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="1. Barem Alt Limit" value={partner.firstScaleLowerLimit} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalFirstScaleUpperLimitInput">
                    <FormLabel>1. Barem Üst Limit</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="1. Barem Üst Limit" value={partner.firstScaleUpperLimit} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalFirstScaleShippingFeeInput">
                    <FormLabel>1. Barem Kargo Ücreti</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="1. Barem Kargo Ücreti" value={partner.firstScaleShippingFee} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalSecondScaleLowerLimitInput">
                    <FormLabel>2. Barem Alt Limit</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="2. Barem Alt Limit" value={partner.secondScaleLowerLimit} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalSecondScaleUpperLimitInput">
                    <FormLabel>2. Barem Üst Limit</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="2. Barem Üst Limit" value={partner.secondScaleUpperLimit} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoPartnerModalSecondScaleShippingFeeInput">
                    <FormLabel>2. Barem Kargo Ücreti</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="2. Barem Kargo Ücreti" value={partner.secondScaleShippingFee} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </MBModal>
    </>
  );
}

interface Props {
  partner: GetByIdPartnerResponse;
}
