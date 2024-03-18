import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeCheck, handleChangeInput } from "../../../../functions";
import partners from "../../../../http/partners";
import CreatePartnerCommand from "../../../../http/partners/models/commands/create/createPartnerCommand";

export default function index({ fetchPartners, disabled, fetchAllPartners }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreatePartnerCommand>({ ...defaultFormValues });
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
      variant: "success",
      text: "Kaydet",
      disabled: loading,
      loading: loading,
      form: formId,
      icon: faSave,
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
      .createPartner(formValues)
      .then((response) => {
        toast.success("Partner başarılı bir şekilde eklendi.");
        handleClose();
        fetchPartners();
      })
      .catch((errorResponse) => {})
      .then(fetchAllPartners)
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...defaultFormValues });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    shippingCost: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    serviceFee: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    transactionFee: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    firstScaleLowerLimit: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    firstScaleUpperLimit: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    firstScaleShippingFee: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    secondScaleLowerLimit: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    secondScaleUpperLimit: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    secondScaleShippingFee: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <MBModal
        id="addPartnerModal"
        size="lg"
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Partner Ekle"
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
                    <FormGroup className="mb-3" controlId="addPartnerModalNameInput">
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
                    <FormGroup className="mb-3" controlId="addPartnerModalShippingCostInput">
                      <FormLabel>Kargo Ücreti</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="addPartnerModalHasTaxShippingCoast"
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
                    <FormGroup className="mb-3" controlId="addPartnerModalServiceFeeLimitInput">
                      <FormLabel>Hizmet Bedeli</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="addPartnerModalHasTaxServiceFee"
                            name="hasTaxServiceFee"
                            checked={formValues.hasTaxServiceFee}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                          />
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.serviceFee && "is-invalid"}
                          placeholder="Hizmet Bedeli"
                          name="serviceFee"
                          value={formValues.serviceFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.serviceFee && <div className="invalid-feedback">{errors.serviceFee}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addPartnerModalHasTaxTransactionFeeInput">
                      <FormLabel>İşlem Ücreti</FormLabel>
                      <InputGroup>
                        <InputGroup.Text>
                          <FormCheck
                            type="switch"
                            label="KDV Dahil"
                            id="addPartnerModalHasTaxTransactionFee"
                            name="hasTaxTransactionFee"
                            checked={formValues.hasTaxTransactionFee}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                          />
                        </InputGroup.Text>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.transactionFee && "is-invalid"}
                          placeholder="İşlem Bedeli"
                          name="transactionFee"
                          value={formValues.transactionFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.transactionFee && <div className="invalid-feedback">{errors.transactionFee}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addPartnerModalHasTaxCommissionsInput">
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
                    <FormGroup className="mb-3" controlId="addPartnerModalHasSecondScaleInput">
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
                        <FormGroup className="mb-3" controlId="addPartnerModalFirstScaleLowerLimitInput">
                          <FormLabel>1. Barem Alt Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.firstScaleLowerLimit && "is-invalid"}
                              placeholder="1. Barem Alt Limit"
                              name="firstScaleLowerLimit"
                              value={formValues.firstScaleLowerLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.firstScaleLowerLimit && <div className="invalid-feedback">{errors.firstScaleLowerLimit}</div>}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="addPartnerModalFirstScaleUpperLimitInput">
                          <FormLabel>1. Barem Üst Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.firstScaleUpperLimit && "is-invalid"}
                              placeholder="1. Barem Üst Limit"
                              name="firstScaleUpperLimit"
                              value={formValues.firstScaleUpperLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.firstScaleUpperLimit && <div className="invalid-feedback">{errors.firstScaleUpperLimit}</div>}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="addPartnerModalFirstScaleShippingFeeInput">
                          <FormLabel>1. Barem Kargo Ücreti</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.firstScaleShippingFee && "is-invalid"}
                              placeholder="1. Barem Kargo Ücreti"
                              name="firstScaleShippingFee"
                              value={formValues.firstScaleShippingFee}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.firstScaleShippingFee && <div className="invalid-feedback">{errors.firstScaleShippingFee}</div>}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="addPartnerModalSecondScaleLowerLimitInput">
                          <FormLabel>2. Barem Alt Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.secondScaleLowerLimit && "is-invalid"}
                              placeholder="2. Barem Alt Limit"
                              name="secondScaleLowerLimit"
                              value={formValues.secondScaleLowerLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.secondScaleLowerLimit && <div className="invalid-feedback">{errors.secondScaleLowerLimit}</div>}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="addPartnerModalSecondScaleUpperLimitInput">
                          <FormLabel>2. Barem Üst Limit</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.secondScaleUpperLimit && "is-invalid"}
                              placeholder="2. Barem Üst Limit"
                              name="secondScaleUpperLimit"
                              value={formValues.secondScaleUpperLimit}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.secondScaleUpperLimit && <div className="invalid-feedback">{errors.secondScaleUpperLimit}</div>}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3" controlId="addPartnerModalSecondScaleShippingFeeInput">
                          <FormLabel>2. Barem Kargo Ücreti</FormLabel>
                          <InputGroup>
                            <FormControl
                              type="number"
                              step="any"
                              className={errors.secondScaleShippingFee && "is-invalid"}
                              placeholder="2. Barem Kargo Ücreti"
                              name="secondScaleShippingFee"
                              value={formValues.secondScaleShippingFee}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                            />
                            <InputGroup.Text>₺</InputGroup.Text>
                            {errors.secondScaleShippingFee && <div className="invalid-feedback">{errors.secondScaleShippingFee}</div>}
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

const defaultFormValues: CreatePartnerCommand = {
  name: "",
  shippingCost: 0,
  serviceFee: 0,
  hasShippingScale: false,
  firstScaleLowerLimit: 0,
  firstScaleShippingFee: 0,
  firstScaleUpperLimit: 0,
  secondScaleLowerLimit: 0,
  secondScaleShippingFee: 0,
  secondScaleUpperLimit: 0,
  transactionFee: 0,
  hasTaxCommissions: false,
  hasTaxServiceFee: false,
  hasTaxShippingCost: false,
  hasTaxTransactionFee: false,
};
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addPartnerForm";

interface Props {
  fetchPartners: () => void;
  disabled: boolean;
  fetchAllPartners: () => void;
}
