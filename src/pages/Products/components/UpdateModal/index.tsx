import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput, handleChangeSelect } from "../../../../functions";
import GetListCategoryListItemDto from "../../../../http/categories/models/responses/getListCategoryListItemDto";
import products from "../../../../http/products";
import UpdateProductCommand from "../../../../http/products/models/commands/updateProductCommand";
import GetListResponse from "../../../../models/getListResponse";
import CustomSpinner from "../../../../components/CustomSpinner";

export default function index({ fetchProducts, product, categoriesLoaded, categoriesResponse }: Props) {
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
    categoryId: Yup.number().required(ValidationRequired).min(1, ValidationInvalid),
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
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <CustomModal closable={false} handleClose={handleClose} show={show} title="Ürün Düzenle" buttons={modalButtons}>
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
                      <FormGroup className="mb-3" controlId="updateProductModalNameInput">
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
                      <FormGroup className="mb-3" controlId="updateProductModalBarcodeNumberInput">
                        <FormLabel>Barkod</FormLabel>
                        <ReactInputMask
                          id="updateProductModalBarcodeNumberInput"
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
                      <FormGroup className="mb-3" controlId="updateProductModalModelNumberInput">
                        <FormLabel>Model</FormLabel>
                        <ReactInputMask
                          id="updateProductModalModelNumberInput"
                          className={errors.modelNumber ? "form-control is-invalid" : "form-control"}
                          mask={"MB-00999"}
                          placeholder="MB-00001"
                          name="modelNumber"
                          value={formValues.modelNumber}
                          onChange={(e: any) => handleChangeInput(e, setFormValues)}
                        />
                        {errors.modelNumber && <div className="invalid-feedback">{errors.modelNumber}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3" controlId="updateProductModalUnitPriceInput">
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
                    <Col md={6}>
                      <FormGroup className="mb-3" controlId="UpdateProductModalCategoryIdSelect">
                        <FormLabel>Kategori</FormLabel>
                        <FormSelect
                          className={errors.categoryId && "is-invalid"}
                          name="categoryId"
                          value={formValues.categoryId}
                          onChange={(e: any) => handleChangeSelect(e, setFormValues)}
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

const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "updateProductForm";

interface Props {
  product: UpdateProductCommand;
  fetchProducts: () => void;
  categoriesResponse: GetListResponse<GetListCategoryListItemDto>;
  categoriesLoaded: boolean;
}
