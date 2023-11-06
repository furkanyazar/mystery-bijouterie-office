import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput } from "../../../../functions";
import products from "../../../../http/products";
import UpdateProductCommand from "../../../../http/products/models/commands/updateProductCommand";

export default function index({ fetchProducts, product }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UpdateProductCommand>({ ...product });
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

    await products
      .updateProduct(formValues)
      .then((response) => {
        toast.success("Ürün başarılı bir şekilde güncellendi.");
        handleClose();
        fetchProducts();
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...product });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    barcodeNumber: Yup.string()
      .required(ValidationRequired)
      .matches(/^MB-\d{10}$/, ValidationInvalid),
    unitPrice: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <CustomModal closable={false} handleClose={handleClose} show={show} title="Ürün Düzenle" buttons={modalButtons}>
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
                        mask={"MB-0000000999"}
                        placeholder="MB-0000000001"
                        name="barcodeNumber"
                        value={formValues.barcodeNumber}
                        onChange={(e: any) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.barcodeNumber && <div className="invalid-feedback">{errors.barcodeNumber}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="addProductModalUnitPriceInput">
                      <FormLabel>Alış Fiyatı</FormLabel>
                      <InputGroup>
                        <FormControl
                          type="number"
                          className={errors.unitPrice && "is-invalid"}
                          placeholder="Alış Fiyatı"
                          name="unitPrice"
                          value={formValues.unitPrice}
                          onChange={(e: any) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.unitPrice && <div className="invalid-feedback">{errors.unitPrice}</div>}
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

const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "updateProductForm";

interface Props {
  product: UpdateProductCommand;
  fetchProducts: () => void;
}
