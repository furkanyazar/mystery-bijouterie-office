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
import materials from "../../../../http/materials";
import UpdateMaterialCommand from "../../../../http/materials/models/commands/update/updateMaterialCommand";

export default function index({ fetchMaterials, material }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UpdateMaterialCommand>({ ...material });
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

    await materials
      .updateMaterial(formValues)
      .then((response) => {
        toast.success("Materyal başarılı bir şekilde güncellendi.");
        handleClose();
        fetchMaterials();
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...material });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    purchasePrice: Yup.number().required(ValidationRequired),
    unitsInStock: Yup.number().required(ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <MBModal
        id={`editMaterialModal-${material.id}`}
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Materyal Düzenle"
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
                    <FormGroup className="mb-3" controlId="updateMaterialModalNameInput">
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
                    <FormGroup className="mb-3" controlId="updateMaterialModalPurchasePriceInput">
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
                  <Col md={6}>
                    <FormGroup className="mb-3" controlId="updateMaterialModalUnitsInStockInput">
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
const formId = "updateMaterialForm";

interface Props {
  material: UpdateMaterialCommand;
  fetchMaterials: () => void;
}
