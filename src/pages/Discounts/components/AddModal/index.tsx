import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput, handleChangeSelect } from "../../../../functions";
import discounts from "../../../../http/discounts";
import CreateDiscountCommand from "../../../../http/discounts/models/commands/create/createDiscountCommand";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import GetListResponse from "../../../../models/getListResponse";
import { DiscountType } from "../../../../jsons/models/DiscountType";

export default function index({ disabled, fetchDiscounts, partnersLoaded, partnersResponse }: Props) {
  const discountTypes: DiscountType[] = require("../../../../jsons/discountTypes.json");

  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateDiscountCommand>({ ...defaultFormValues });
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

    await discounts
      .createDiscount(formValues)
      .then((response) => {
        toast.success("İndirim başarılı bir şekilde eklendi.");
        handleClose();
        fetchDiscounts();
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
    discountAmount: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    discountType: Yup.number().required(ValidationRequired).min(1, ValidationInvalid),
    partnerId: Yup.number().required(ValidationRequired).min(1, ValidationInvalid),
    discountLowerLimit: Yup.number().required(ValidationRequired).min(0, ValidationInvalid),
    priority: Yup.number().required(ValidationRequired).min(1, ValidationInvalid),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <MBModal id="addDiscountModal" closable={false} handleClose={handleClose} show={show} title="İndirim Ekle" buttons={modalButtons}>
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
                    <FormGroup className="mb-3" controlId="addDiscountModalNameInput">
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
                    <FormGroup className="mb-3" controlId="addDiscountModalPartnerIdSelect">
                      <FormLabel>Partner</FormLabel>
                      <FormSelect
                        className={errors.partnerId && "is-invalid"}
                        name="partnerId"
                        value={formValues.partnerId ?? 0}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setFormValues)}
                        disabled={!partnersLoaded}
                      >
                        <option value={0} disabled>
                          Seçiniz
                        </option>
                        {partnersResponse?.items
                          ?.sort((a, b) => a.name.localeCompare(b.name))
                          .map((partner) => (
                            <option key={partner.id} value={partner.id}>
                              {partner.name}
                            </option>
                          ))}
                      </FormSelect>
                      {errors.partnerId && <div className="invalid-feedback">{errors.partnerId}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addDiscountModalPriorityInput">
                      <FormLabel>Öncelik Sırası</FormLabel>
                      <FormControl
                        type="number"
                        step="any"
                        className={errors.priority && "is-invalid"}
                        placeholder="Öncelik Sırası"
                        name="priority"
                        value={formValues.priority}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addDiscountModalDiscountTypeSelect">
                      <FormLabel>İndirim Tipi</FormLabel>
                      <FormSelect
                        className={errors.discountType && "is-invalid"}
                        name="discountType"
                        value={formValues.discountType ?? 0}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setFormValues)}
                        disabled={!partnersLoaded}
                      >
                        <option value={0} disabled>
                          Seçiniz
                        </option>
                        {discountTypes.map((discountType) => (
                          <option key={discountType.id} value={discountType.id}>
                            {discountType.name}
                          </option>
                        ))}
                      </FormSelect>
                      {errors.discountType && <div className="invalid-feedback">{errors.discountType}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addDiscountModalDiscountLowerLimitInput">
                      <FormLabel>İndirim Alt Limiti</FormLabel>
                      <InputGroup>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.discountLowerLimit && "is-invalid"}
                          placeholder="İndirim Alt Limiti"
                          name="discountLowerLimit"
                          value={formValues.discountLowerLimit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.discountLowerLimit && <div className="invalid-feedback">{errors.discountLowerLimit}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addDiscountModalDiscountAmountInput">
                      <FormLabel>{formValues.discountType == 1 ? "İndirim Yüzdesi" : "İndirim Tutarı"}</FormLabel>
                      <InputGroup>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.discountAmount && "is-invalid"}
                          placeholder={formValues.discountType == 1 ? "İndirim Yüzdesi" : "İndirim Tutarı"}
                          name="discountAmount"
                          value={formValues.discountAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>{formValues.discountType == 1 ? "%" : "₺"}</InputGroup.Text>
                        {errors.discountAmount && <div className="invalid-feedback">{errors.discountAmount}</div>}
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

const defaultFormValues: CreateDiscountCommand = {
  discountAmount: 0,
  discountType: 0,
  name: "",
  partnerId: 0,
  discountLowerLimit: 0,
  priority: 0,
};
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addDiscountForm";

interface Props {
  fetchDiscounts: () => void;
  partnersResponse: GetListResponse<GetListPartnerListItemDto>;
  partnersLoaded: boolean;
  disabled: boolean;
}
