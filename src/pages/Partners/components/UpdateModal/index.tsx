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
    freeShippingLowerLimit: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <MBModal
        id={`editPartnerModal-${partner.id}`}
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
                  <Col md={12}>
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
                    <FormGroup className="mb-3" controlId="updatePartnerModalHasFreeShippingSInput">
                      <FormLabel></FormLabel>
                      <FormCheck
                        type="switch"
                        label="Ücretsiz Kargo Alt Limiti"
                        name="hasFreeShipping"
                        checked={formValues.hasFreeShipping}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updatePartnerModalFreeShippingLowerLimitInput">
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
