import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CustomModal, { ButtonProps } from "../../../../../components/Modals/CustomModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../../constants/validationMessages";
import { handleChangeInput } from "../../../../../functions";
import products from "../../../../../http/products";
import CreateProductCommand from "../../../../../http/products/models/commands/createProductCommand";
import ErrorResponse from "../../../../../models/errorResponse";

export default function AddProductModal({ fetchProducts }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateProductCommand>({ ...defaultFormValues });
  const [loading, setLoading] = useState<boolean>(false);
  const [modalButtons, setModalButtons] = useState<ButtonProps[]>([
    {
      key: cancelButtonKey,
      variant: "danger",
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

    await products
      .createProduct(formValues)
      .then((response) => {
        handleClose();
        fetchProducts();
        toast.success("Ürün başarılı bir şekilde eklendi.");
      })
      .catch((errorResponse: AxiosError<ErrorResponse>) => toast.error(errorResponse.response.data.detail))
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...defaultFormValues });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    barcodeNumber: Yup.string()
      .notRequired()
      .matches(/^MB-\d{10}$/, ValidationInvalid),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <CustomModal closable={false} handleClose={handleClose} show={show} title="Ürün Ekle" buttons={modalButtons}>
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
                    <FormGroup className="mb-3" controlId="addProductModalNameInput">
                      <FormLabel>Ad</FormLabel>
                      <FormControl
                        className={errors.name && "is-invalid"}
                        placeholder="Ad"
                        name="name"
                        value={formValues.name}
                        onChange={(e: any) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addProductModalBarcodeNumberInput">
                      <FormLabel>Barkod</FormLabel>
                      <ReactInputMask
                        id="addProductModalBarcodeNumberInput"
                        className={errors.barcodeNumber ? "form-control is-invalid" : "form-control"}
                        mask={"MB-9999999999"}
                        placeholder="MB-0000000001"
                        name="barcodeNumber"
                        value={formValues.barcodeNumber ?? ""}
                        onChange={(e: any) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.barcodeNumber && <div className="invalid-feedback">{errors.barcodeNumber}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addProductModalUnitPriceInput">
                      <FormLabel>Alış Fiyatı</FormLabel>
                      <InputGroup className="mb-3">
                        <FormControl
                          type="number"
                          placeholder="Alış Fiyatı"
                          name="unitPrice"
                          value={formValues.unitPrice}
                          onChange={(e: any) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                      </InputGroup>
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

const defaultFormValues: CreateProductCommand = { name: "", barcodeNumber: null, unitPrice: 0 };
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addProductForm";

interface Props {
  fetchProducts: () => void;
}
