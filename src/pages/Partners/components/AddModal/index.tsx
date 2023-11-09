import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import { ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeCheck, handleChangeInput } from "../../../../functions";
import partners from "../../../../http/partners";
import CreatePartnerCommand from "../../../../http/partners/models/commands/create/createPartnerCommand";

export default function index({ fetchPartners, disabled }: Props) {
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
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...defaultFormValues });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    shippingCost: Yup.number().required(ValidationRequired),
    freeShippingLowerLimit: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <CustomModal closable={false} handleClose={handleClose} show={show} title="Partner Ekle" buttons={modalButtons}>
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
                  <Col md={12}>
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
                    <FormGroup className="mb-3" controlId="addPartnerModalFreeShippingLowerLimitInput">
                      <FormLabel>Ücretsiz Kargo Alt Limiti</FormLabel>
                      <InputGroup>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.freeShippingLowerLimit && "is-invalid"}
                          placeholder="Ücretsiz Kargo Alt Limiti"
                          name="freeShippingLowerLimit"
                          value={formValues.freeShippingLowerLimit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                          disabled={!formValues.hasFreeShipping}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.freeShippingLowerLimit && <div className="invalid-feedback">{errors.freeShippingLowerLimit}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup className="mb-3" controlId="addPartnerModalHasFreeShippingSInput">
                      <FormCheck
                        type="switch"
                        label="Ücretsiz Kargo Alt Limiti"
                        name="hasFreeShipping"
                        checked={formValues.hasFreeShipping}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Container>
      </CustomModal>
    </>
  );
}

const defaultFormValues: CreatePartnerCommand = { name: "", shippingCost: 0, freeShippingLowerLimit: 0, hasFreeShipping: true };
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addPartnerForm";

interface Props {
  fetchPartners: () => void;
  disabled: boolean;
}
