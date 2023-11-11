import { faPlus, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBSpinner from "../../../../components/MBSpinner";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeEditor, handleChangeInput, handleChangeSelect } from "../../../../functions";
import GetListCategoryListItemDto from "../../../../http/categories/models/queries/getList/getListCategoryListItemDto";
import products from "../../../../http/products";
import CreateProductCommand from "../../../../http/products/models/commands/create/createProductCommand";
import { DefaultProductDescription } from "../../../../jsons/models/DefaultProductDescription";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ fetchProducts, categoriesLoaded, categoriesResponse, disabled }: Props) {
  const defaultProductDescriptions: DefaultProductDescription[] = require("../../../../jsons/defaultProductDescriptions.json");

  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateProductCommand>({ ...defaultFormValues });
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>(null);
  const [defaultDescription, setDefaultDescription] = useState<number>(0);
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

  useEffect(() => {
    if (defaultDescription !== 0) {
      const description = defaultProductDescriptions.find((c) => c.id === defaultDescription);
      if (description) setFormValues((prev) => ({ ...prev, description: description.description }));
    }
  }, [defaultDescription]);

  const handleSubmit = async () => {
    setLoading(true);

    const image = file ? new FormData() : null;
    if (image) image.append("formFile", file);

    await products
      .createProduct({ ...formValues, image })
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

  const handleChangeFileInput = (e: any) => setFile(e.target.files[0]);

  const handleClickRemoveFile = () => setFile(null);

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
      <MBModal closable={false} handleClose={handleClose} show={show} title="Ürün Ekle" buttons={modalButtons}>
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
                            step="any"
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
                    <Col md={12} className="mb-3">
                      <FormGroup controlId="addProductModalDescriptionInput">
                        <FormLabel>Açıklama</FormLabel>
                        <FormSelect
                          className="mb-1"
                          value={defaultDescription}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setDefaultDescription(Number.parseInt(e.target.value))}
                        >
                          <option value={0}>Özel</option>
                          {defaultProductDescriptions.map((description) => (
                            <option key={description.id} value={description.id}>
                              {description.name}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      <MBTextEditor
                        id="addProductModalDescriptionEditor"
                        value={formValues.description ?? ""}
                        onChange={(event: any, editor: any) => {
                          setDefaultDescription(0);
                          handleChangeEditor(event, editor, setFormValues);
                        }}
                      />
                    </Col>
                    <Col md={12}>
                      <FormGroup controlId="addProductModalImageInput" className="mb-3">
                        <FormLabel>Görsel Yükle</FormLabel>
                        <InputGroup>
                          <FormControl type="file" accept="image/*" onChange={handleChangeFileInput} disabled />
                          <Button variant="danger" onClick={handleClickRemoveFile} disabled={!file}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          ) : (
            <MBSpinner />
          )}
        </Container>
      </MBModal>
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
