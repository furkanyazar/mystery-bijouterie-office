import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { faPlus, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeEditor, handleChangeInput, handleChangeSelect } from "../../../../functions";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import products from "../../../../http/products";
import CreateProductCommand from "../../../../http/products/models/commands/create/createProductCommand";
import { DefaultProductDescription } from "../../../../jsons/models/DefaultProductDescription";

export default function index({ fetchProducts, disabled }: Props) {
  const defaultProductDescriptions: DefaultProductDescription[] = require("../../../../jsons/defaultProductDescriptions.json");

  const { categories, materials } = useAppSelector((state) => state.appItems);

  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateProductCommand>({ ...defaultFormValues });
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>(null);
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
      if (description) {
        tempDescription = description.description;
        setFormValues((prev) => ({ ...prev, description: description.description }));
      }
    }
  }, [defaultDescription]);

  const handleSubmit = async () => {
    await addProduct()
      .then(async (addProductResponse: any) => {
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          await uploadImage(addProductResponse.data.id, formData);
        }
      })
      .then(() => {
        handleClose();
        fetchProducts();
      });
  };

  const addProduct = async () => {
    setLoading(true);
    return await products
      .createProduct(formValues)
      .then((response) => {
        toast.success("Ürün başarılı bir şekilde eklendi.");
        return response;
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const uploadImage = async (productId: number, formData: FormData) => {
    setLoading(true);
    await products
      .uploadImage(productId, formData)
      .then((response) => toast.success("Ürün görseli başarılı bir şekilde yüklendi."))
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...defaultFormValues });
  };

  const handleChangeFileInput = (e: any) => setImage(e.target.files[0]);

  const handleClickRemoveFile = () => setImage(null);

  const validationSchema = Yup.object({
    categoryId: Yup.number().notRequired().min(1, ValidationInvalid),
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    barcodeNumber: Yup.string().required(ValidationRequired),
    modelNumber: Yup.string().required(ValidationRequired),
    purchasePrice: Yup.number().required(ValidationRequired),
    unitsInStock: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <MBModal
        id="addProductModal"
        size="lg"
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Ürün Ekle"
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
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalStockCodeInput">
                      <FormLabel>Stok Kodu</FormLabel>
                      <FormControl
                        className={errors.stockCode && "is-invalid"}
                        placeholder="Stok Kodu"
                        name="stockCode"
                        value={formValues.stockCode ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.stockCode && <div className="invalid-feedback">{errors.stockCode}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalBarcodeNumberInput">
                      <FormLabel>Barkod No.</FormLabel>
                      <FormControl
                        className={errors.barcodeNumber ? "form-control is-invalid" : "form-control"}
                        placeholder="Barkod No."
                        name="barcodeNumber"
                        value={formValues.barcodeNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.barcodeNumber && <div className="invalid-feedback">{errors.barcodeNumber}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalModelNumberInput">
                      <FormLabel>Model No.</FormLabel>
                      <FormControl
                        className={errors.modelNumber ? "form-control is-invalid" : "form-control"}
                        placeholder="Model No."
                        name="modelNumber"
                        value={formValues.modelNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.modelNumber && <div className="invalid-feedback">{errors.modelNumber}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalCategoryIdSelect">
                      <FormLabel>Kategori</FormLabel>
                      <FormSelect
                        className={errors.categoryId && "is-invalid"}
                        name="categoryId"
                        value={formValues.categoryId ?? 0}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setFormValues)}
                      >
                        <option value={0}>Seçiniz</option>
                        {[...categories]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </FormSelect>
                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalUnitPriceInput">
                      <FormLabel>Alış Fiyatı</FormLabel>
                      <InputGroup>
                        <FormControl
                          type="number"
                          step="any"
                          className={errors.purchasePrice && "is-invalid"}
                          placeholder="Alış Fiyatı"
                          name="purchasePrice"
                          value={formValues.purchasePrice}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                        />
                        <InputGroup.Text>₺</InputGroup.Text>
                        {errors.purchasePrice && <div className="invalid-feedback">{errors.purchasePrice}</div>}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-3" controlId="addProductModalUnitsInStockInput">
                      <FormLabel>Stok Miktarı</FormLabel>
                      <FormControl
                        type="number"
                        step="any"
                        className={errors.unitsInStock && "is-invalid"}
                        placeholder="Stok Miktarı"
                        name="unitsInStock"
                        value={formValues.unitsInStock}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setFormValues)}
                      />
                      {errors.unitsInStock && <div className="invalid-feedback">{errors.unitsInStock}</div>}
                    </FormGroup>
                  </Col>
                  <Col md={12} className="mb-3">
                    <FormGroup controlId="addProductModalDescriptionInput">
                      <FormLabel>Açıklama</FormLabel>
                      <FormSelect
                        className="mb-1"
                        value={defaultDescription}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDefaultDescription(Number.parseInt(e.target.value))}
                      >
                        <option value={0}>Özel</option>
                        {defaultProductDescriptions
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((description) => (
                            <option key={description.id} value={description.id}>
                              {description.name}
                            </option>
                          ))}
                      </FormSelect>
                    </FormGroup>
                    <MBTextEditor
                      id="addProductModalDescriptionEditor"
                      value={formValues.description ?? ""}
                      onChange={(_: any, editor: ClassicEditor) => {
                        if (editor.getData() !== tempDescription) setDefaultDescription(0);
                        handleChangeEditor("description", editor, setFormValues);
                      }}
                    />
                  </Col>
                  <Col md={12}>
                    <FormGroup controlId="addProductModalImageInput" className="mb-3">
                      <FormLabel>Görsel Yükle</FormLabel>
                      <InputGroup>
                        <FormControl type="file" accept="image/*" onChange={handleChangeFileInput} />
                        <Button variant="danger" onClick={handleClickRemoveFile} disabled={!image}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <hr />
                  <h6 className="mb-3">Materyaller</h6>
                  {[...materials]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((material) => (
                      <Col className="col-auto mb-1" key={material.id}>
                        <FormGroup controlId={`addProductModalMaterialInput-${material.id}`}>
                          <FormCheck
                            label={material.name}
                            checked={formValues.productMaterials.map((c) => c.materialId).includes(material.id)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.checked) {
                                setFormValues((prev) => ({
                                  ...prev,
                                  productMaterials: [...prev.productMaterials, { materialId: material.id }],
                                }));
                              } else {
                                setFormValues((prev) => ({
                                  ...prev,
                                  productMaterials: [...prev.productMaterials.filter((c) => c.materialId !== material.id)],
                                }));
                              }
                            }}
                          />
                        </FormGroup>
                      </Col>
                    ))}
                </Row>
              </Form>
            )}
          </Formik>
        </Container>
      </MBModal>
    </>
  );
}

const defaultFormValues: CreateProductCommand = {
  categoryId: null,
  name: "",
  barcodeNumber: "",
  modelNumber: "",
  purchasePrice: 0,
  description: null,
  productMaterials: [],
  stockCode: null,
  unitsInStock: 0,
};
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addProductForm";

interface Props {
  fetchProducts: () => void;
  disabled: boolean;
}

let tempDescription = "";
