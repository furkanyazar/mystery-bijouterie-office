import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CustomSpinner from "../../../../components/CustomSpinner";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput, handleChangeSelect } from "../../../../functions";
import GetListCategoryListItemDto from "../../../../http/categories/models/queries/getList/getListCategoryListItemDto";
import products from "../../../../http/products";
import CreateProductCommand from "../../../../http/products/models/commands/create/createProductCommand";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ fetchProducts, categoriesLoaded, categoriesResponse, disabled }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateProductCommand>({ ...defaultFormValues });
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

    await products
      .createProduct(formValues)
      .then((response) => {
        toast.success("Ürün başarılı bir şekilde eklendi.");
        handleClose();
        fetchProducts();
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
    categoryId: Yup.number().notRequired().min(1, ValidationInvalid),
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    barcodeNumber: Yup.string()
      .required(ValidationRequired)
      .matches(/^MB-\d{10}$/, ValidationInvalid),
    modelNumber: Yup.string()
      .required(ValidationRequired)
      .matches(/^MB-\d{5}$/, ValidationInvalid),
    unitPrice: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <CustomModal closable={false} handleClose={handleClose} show={show} title="Ürün Ekle" buttons={modalButtons}>
        <Container>
          {categoriesLoaded ? (
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3" controlId="addProductModalBarcodeNumberInput">
                        <FormLabel>Barkod No.</FormLabel>
                        <ReactInputMask
                          id="addProductModalBarcodeNumberInput"
                          className={errors.barcodeNumber ? "form-control is-invalid" : "form-control"}
                          mask={"MB-0000000999"}
                          placeholder="MB-0000000001"
                          name="barcodeNumber"
                          value={formValues.barcodeNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        {errors.barcodeNumber && <div className="invalid-feedback">{errors.barcodeNumber}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3" controlId="addProductModalModelNumberInput">
                        <FormLabel>Model No.</FormLabel>
                        <ReactInputMask
                          id="addProductModalModelNumberInput"
                          className={errors.modelNumber ? "form-control is-invalid" : "form-control"}
                          mask={"MB-00999"}
                          placeholder="MB-00001"
                          name="modelNumber"
                          value={formValues.modelNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        {errors.modelNumber && <div className="invalid-feedback">{errors.modelNumber}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3" controlId="addProductModalCategoryIdSelect">
                        <FormLabel>Kategori</FormLabel>
                        <FormSelect
                          className={errors.categoryId && "is-invalid"}
                          name="categoryId"
                          value={formValues.categoryId ?? 0}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setFormValues)}
                        >
                          <option value={0} disabled>
                            Seçiniz
                          </option>
                          {categoriesResponse?.items
                            ?.sort((a, b) => a.name.localeCompare(b.name))
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </FormSelect>
                        {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
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
          ) : (
            <CustomSpinner />
          )}
        </Container>
      </CustomModal>
    </>
  );
}

const defaultFormValues: CreateProductCommand = { categoryId: null, name: "", barcodeNumber: "", modelNumber: "", unitPrice: 0 };
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addProductForm";

interface Props {
  fetchProducts: () => void;
  categoriesResponse: GetListResponse<GetListCategoryListItemDto>;
  categoriesLoaded: boolean;
  disabled: boolean;
}
