import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput } from "../../../../functions";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import categories from "../../../../http/categories";
import CreateCategoryCommand from "../../../../http/categories/models/commands/create/createCategoryCommand";

export default function index({ fetchCategories, disabled, fetchAllCategories }: Props) {
  const { partners } = useAppSelector((state) => state.appItems);

  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<CreateCategoryCommand>({ ...defaultFormValues });
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
    if (partners) {
      const categoryPartners = [...partners.map((partner) => ({ partnerId: partner.id, commissionRate: 0 }))];
      defaultFormValues.categoryPartners = [...categoryPartners];
      setFormValues((prev) => ({ ...prev, categoryPartners: [...categoryPartners] }));
    }
  }, [partners]);

  useEffect(() => {
    setModalButtons((prev) => [
      ...prev.map((p) => (p.type === "submit" ? { ...p, loading, disabled: loading } : { ...p, disabled: loading })),
    ]);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);

    await categories
      .createCategory(formValues)
      .then((response) => {
        toast.success("Kategori başarılı bir şekilde eklendi.");
        handleClose();
        fetchCategories();
      })
      .catch((errorResponse) => {})
      .then(fetchAllCategories)
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setFormValues({ ...defaultFormValues });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    categoryPartners: Yup.array().of(Yup.object({ commissionRate: Yup.number().required(ValidationRequired) })),
  });

  return (
    <>
      <Button variant="success" onClick={handleShow} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Ekle
      </Button>
      <MBModal id="addCategoryModal" closable={false} handleClose={handleClose} show={show} title="Kategori Ekle" buttons={modalButtons}>
        <Container>
          <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ errors }: any) => (
              <Form id={formId}>
                <Row>
                  <Col md={12}>
                    <FormGroup className="mb-3" controlId="addCategoryModalNameInput">
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
                  {formValues.categoryPartners
                    .sort((a, b) => a.partnerId - b.partnerId)
                    .map((categoryPartner, index) => (
                      <Col key={categoryPartner.partnerId} md={6}>
                        <FormGroup className="mb-3" controlId={"addCategoryModalPartnerInput-" + categoryPartner.partnerId}>
                          <FormLabel>{partners.find((partner) => partner.id === categoryPartner.partnerId)?.name} Komisyon O.</FormLabel>
                          <FormControl
                            className={errors.categoryPartners && errors.categoryPartners[index] && "is-invalid"}
                            type="number"
                            step="any"
                            placeholder={partners.find((partner) => partner.id === categoryPartner.partnerId)?.name + " Komisyon O."}
                            value={
                              (categoryPartner.commissionRate && !isNaN(categoryPartner.commissionRate)) ||
                              categoryPartner.commissionRate === 0
                                ? categoryPartner.commissionRate
                                : ""
                            }
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFormValues((prev) => ({
                                ...prev,
                                categoryPartners: [
                                  ...prev.categoryPartners.filter((c) => c.partnerId !== categoryPartner.partnerId),
                                  {
                                    ...categoryPartner,
                                    commissionRate: e.target.value ? Number.parseFloat(e.currentTarget.value) : null,
                                  },
                                ],
                              }));
                            }}
                          />
                          {errors.categoryPartners && errors.categoryPartners[index] && (
                            <div className="invalid-feedback">{errors.categoryPartners[index].commissionRate}</div>
                          )}
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

const defaultFormValues: CreateCategoryCommand = { name: "", categoryPartners: [] };
const cancelButtonKey = "cancel";
const submitButtonKey = "submit";
const formId = "addCategoryForm";

interface Props {
  fetchCategories: () => void;
  fetchAllCategories: () => void;
  disabled: boolean;
}
