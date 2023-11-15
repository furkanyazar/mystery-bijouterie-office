import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { faPen, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBSpinner from "../../../../components/MBSpinner";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationInvalid, ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeCheck, handleChangeEditor, handleChangeInput, handleChangeSelect } from "../../../../functions";
import GetListCategoryListItemDto from "../../../../http/categories/models/queries/getList/getListCategoryListItemDto";
import products from "../../../../http/products";
import UpdateProductCommand from "../../../../http/products/models/commands/update/updateProductCommand";
import { DefaultProductDescription } from "../../../../jsons/models/DefaultProductDescription";
import GetListResponse from "../../../../models/getListResponse";
import ModalImage from "react-modal-image";

export default function index({ fetchProducts, product, categoriesLoaded, categoriesResponse, imageUrl }: Props) {
  const defaultProductDescriptions: DefaultProductDescription[] = require("../../../../jsons/defaultProductDescriptions.json");

  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UpdateProductCommand>({ ...product });
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
    await updateProduct()
      .then(async (updateProductResponse: any) => {
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          await uploadImage(updateProductResponse.data.id, formData);
        }
      })
      .then(() => {
        handleClose();
        fetchProducts();
      });
  };

  const updateProduct = async () => {
    setLoading(true);
    return await products
      .updateProduct(formValues)
      .then((response) => {
        toast.success("Ürün başarılı bir şekilde güncellendi.");
        return response;
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const uploadImage = async (productId: number, formData: FormData) => {
    setLoading(true);
    await products
      .uploadImage(productId, formData)
      .then((response) => toast.success("Ürün görseli başarılı bir şekilde güncellendi."))
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...product });
  };

  const handleChangeFileInput = (e: any) => setImage(e.target.files[0]);

  const handleClickRemoveFile = () => setImage(null);

  const validationSchema = Yup.object({
    categoryId: Yup.number().notRequired().min(1, ValidationInvalid),
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    barcodeNumber: Yup.string()
      .required(ValidationRequired)
      .matches(/^MB-\d{10}$/, ValidationInvalid),
    modelNumber: Yup.string()
      .required(ValidationRequired)
      .matches(/^MB-\d{5}$/, ValidationInvalid),
    purchasePrice: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <MBModal
        id={`editProductModal-${product.id}`}
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Ürün Düzenle"
        buttons={modalButtons}
        size="xl"
        footerLeft={
          <FormCheck
            type="switch"
            id="updateProductModalStatusCheck"
            label="Stokta Var"
            name="status"
            checked={formValues.status}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCheck(e, setFormValues)}
          />
        }
      >
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
                    <Col md={12} lg={4} className="mb-3">
                      <Row>
                        <Col md={12} className="mb-3">
                          <FormLabel>Görsel</FormLabel>
                          <ModalImage small={imageUrl ?? defaultImageUrl} large={imageUrl ?? defaultImageUrl} className="img-thumbnail" />
                        </Col>
                        <Col md={12}>
                          <FormGroup controlId="updateProductModalImageInput" className="mb-3">
                            <FormLabel>Görsel Yükle</FormLabel>
                            <InputGroup>
                              <FormControl type="file" accept="image/*" onChange={handleChangeFileInput} />
                              <Button variant="danger" onClick={handleClickRemoveFile} disabled={!image}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12} lg={8}>
                      <Row>
                        <Col md={12}>
                          <FormGroup className="mb-3" controlId="updateProductModalNameInput">
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
                          <FormGroup className="mb-3" controlId="updateProductModalBarcodeNumberInput">
                            <FormLabel>Barkod No.</FormLabel>
                            <ReactInputMask
                              id="updateProductModalBarcodeNumberInput"
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
                          <FormGroup className="mb-3" controlId="updateProductModalModelNumberInput">
                            <FormLabel>Model No.</FormLabel>
                            <ReactInputMask
                              id="updateProductModalModelNumberInput"
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
                          <FormGroup className="mb-3" controlId="UpdateProductModalCategoryIdSelect">
                            <FormLabel>Kategori</FormLabel>
                            <FormSelect
                              className={errors.categoryId && "is-invalid"}
                              name="categoryId"
                              value={formValues.categoryId ?? 0}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setFormValues)}
                            >
                              <option value={0}>Seçiniz</option>
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
                          <FormGroup className="mb-3" controlId="updateProductModalUnitPriceInput">
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
                        <Col md={12} className="mb-3">
                          <FormGroup controlId="updateProductModalDescriptionInput">
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
                            id="updateProductModalDescriptionEditor"
                            value={formValues.description ?? ""}
                            onChange={(_: any, editor: ClassicEditor) => {
                              if (editor.getData() !== tempDescription) setDefaultDescription(0);
                              handleChangeEditor("description", editor, setFormValues);
                            }}
                          />
                        </Col>
                      </Row>
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

const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "updateProductForm";

interface Props {
  product: UpdateProductCommand;
  fetchProducts: () => void;
  categoriesResponse: GetListResponse<GetListCategoryListItemDto>;
  categoriesLoaded: boolean;
  imageUrl?: string;
}

let tempDescription = "";

const defaultImageUrl = process.env.DEFAULT_IMAGE_URL;
