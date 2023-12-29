import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeCheck, handleChangeInput } from "../../../../functions";
import partners from "../../../../http/partners";
import UpdatePartnerCommand from "../../../../http/partners/models/commands/update/updatePartnerCommand";

export default function index({ fetchPartners, partner }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UpdatePartnerCommand>({ ...partner });
  const [loading, setLoading] = useState<boolean>(false);
  const [modalButtons, setModalButtons] = useState<ButtonProps[]>([
    {
      key: cancelButtonKey,
      variant: "secondary",
      text: "Vazgeç",
      disabled: loading,
      loading: loading,
      handleClick: () => handleClose(),
      icon: faXmark,
    },
    {
      key: submitButtonKey,
      type: "submit",
      variant: "warning",
      text: "Kaydet",
      disabled: loading,
      loading: loading,
      form: formId,
      icon: faSave,
      className: "text-white",
    },
  ]);

  useEffect(() => {
    setModalButtons((prev) => [
      ...prev.map((p) => (p.type === "submit" ? { ...p, loading, disabled: loading } : { ...p, disabled: loading })),
    ]);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);

    await partners
      .updatePartner(formValues)
      .then((response) => {
        toast.success("Partner başarılı bir şekilde güncellendi.");
        handleClose();
        fetchPartners();
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...partner });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    shippingCost: Yup.number().required(ValidationRequired),
    serviceFee: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <MBModal
        id={`editPartnerModal-${partner.id}`}
        size="lg"
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Partner Düzenle"
        buttons={modalButtons}
      >
        <Container>
          <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ errors }) => (
              <Form id={formId}>
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalNameInput">
                      <FormLabel>Ad</FormLabel>
                      <FormControl
                        className={errors.name && "is-invalid"}
                        placeholder="Ad"
                        name="name"
                        value={formValues.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalShippingCostInput">
                      <FormLabel>Kargo Ücreti</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="updatePartnerModalHasTaxShippingCoast"
                            name="hasTaxShippingCost"
                            checked={formValues.hasTaxShippingCost}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                          />
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.shippingCost && "is-invalid"}
                          placeholder="Kargo Ücreti"
                          name="shippingCost"
                          value={formValues.shippingCost}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.shippingCost && <div className="invalid-feedback">{errors.shippingCost}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalServiceFeeInput">
                      <FormLabel>Hizmet Bedeli</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="updatePartnerModalHasTaxServiceFee"
                            name="hasTaxServiceFee"
                            checked={formValues.hasTaxServiceFee}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                          />
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          step="any"
                          placeholder="Hizmet Bedeli"
                          name="serviceFee"
                          value={formValues.serviceFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalTransactionFeeInput">
                      <FormLabel>İşlem Ücreti</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="updatePartnerModalHasTaxTransactionFee"
                            name="hasTaxTransactionFee"
                            checked={formValues.hasTaxTransactionFee}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                          />
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          step="any"
                          placeholder="İşlem Ücreti"
                          name="transactionFee"
                          value={formValues.transactionFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalHasFirstScaleInput">
                      <FormCheck
                        type="switch"
                        label="Komisyonlara KDV Dahil"
                        name="hasTaxCommissions"
                        checked={formValues.hasTaxCommissions}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalHasSecondScaleInput">
                      <FormCheck
                        type="switch"
                        label="Kargo Barem Uygulaması"
                        name="hasShippingScale"
                        checked={formValues.hasShippingScale}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                      />
                    </FormGroup>
                  </Col>
                  {formValues.hasShippingScale && (
                    <>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalFirstScaleLowerLimitInput">
                          <FormLabel>1. Barem Alt Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="1. Barem Alt Limit"
                              name="firstScaleLowerLimit"
                              value={formValues.firstScaleLowerLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalFirstScaleUpperLimitInput">
                          <FormLabel>1. Barem Üst Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="1. Barem Üst Limit"
                              name="firstScaleUpperLimit"
                              value={formValues.firstScaleUpperLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalFirstScaleShippingFeeInput">
                          <FormLabel>1. Barem Kargo Ücreti</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="1. Barem Kargo Ücreti"
                              name="firstScaleShippingFee"
                              value={formValues.firstScaleShippingFee}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalSecondScaleLowerLimitInput">
                          <FormLabel>2. Barem Alt Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="2. Barem Alt Limit"
                              name="secondScaleLowerLimit"
                              value={formValues.secondScaleLowerLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalSecondScaleUpperLimitInput">
                          <FormLabel>2. Barem Üst Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="2. Barem Üst Limit"
                              name="secondScaleUpperLimit"
                              value={formValues.secondScaleUpperLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="updatePartnerModalSecondScaleShippingFeeInput">
                          <FormLabel>2. Barem Kargo Ücreti</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              placeholder="2. Barem Kargo Ücreti"
                              name="secondScaleShippingFee"
                              value={formValues.secondScaleShippingFee}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </Container>
      </MBModal>
    </>
  );
}

const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "updatePartnerForm";

interface Props {
  partner: UpdatePartnerCommand;
  fetchPartners: () => void;
}
