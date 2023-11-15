import { faPen, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBSpinner from "../../../../components/MBSpinner";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationMinLength, ValidationRequired } from "../../../../constants/validationMessages";
import { handleChangeInput } from "../../../../functions";
import categories from "../../../../http/categories";
import UpdateCategoryCommand from "../../../../http/categories/models/commands/update/updateCategoryCommand";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ fetchCategories, category, partnersLoaded, partnersResponse }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UpdateCategoryCommand>({ ...category });
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
    if (partnersLoaded) {
      const categoryPartners = [...partnersResponse?.items?.map((partner) => ({ id: 0, partnerId: partner.id, commissionRate: 0 }))];
      setFormValues((prev) => ({
        ...prev,
        categoryPartners: [
          ...prev.categoryPartners,
          ...categoryPartners.filter((c) => !prev.categoryPartners.map((x) => x.partnerId).includes(c.partnerId)),
        ],
      }));
    }
  }, [partnersResponse, partnersLoaded]);

  useEffect(() => {
    setModalButtons((prev) => [
      ...prev.map((p) => (p.type === "submit" ? { ...p, loading, disabled: loading } : { ...p, disabled: loading })),
    ]);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);

    await categories
      .updateCategory(formValues)
      .then((response) => {
        toast.success("Kategori başarılı bir şekilde güncellendi.");
        handleClose();
        fetchCategories();
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    const categoryPartners = [...partnersResponse?.items?.map((partner) => ({ id: 0, partnerId: partner.id, commissionRate: 0 }))];
    setFormValues({
      ...category,
      categoryPartners: [
        ...category.categoryPartners,
        ...categoryPartners.filter((c) => !category.categoryPartners.map((x) => x.partnerId).includes(c.partnerId)),
      ],
    });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    categoryPartners: Yup.array().of(Yup.object({ commissionRate: Yup.number().required(ValidationRequired) })),
  });

  return (
    <>
      <Button className="btn-sm text-white ms-1" variant="warning" onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <MBModal
        id={`editCategoryModal-${category.id}`}
        closable={false}
        handleClose={handleClose}
        show={show}
        title="Kategori Düzenle"
        buttons={modalButtons}
      >
        <Container>
          {partnersLoaded ? (
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
                      <FormGroup className="mb-3" controlId="updateCategoryModalNameInput">
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
                          <FormGroup className="mb-3" controlId={"updateCategoryModalPartnerInput-" + categoryPartner.partnerId}>
                            <FormLabel>
                              {partnersResponse?.items.find((partner) => partner.id === categoryPartner.partnerId)?.name} Komisyon O.
                            </FormLabel>
                            <FormControl
                              className={errors.categoryPartners && errors.categoryPartners[index] && "is-invalid"}
                              type="number"
                              step="any"
                              placeholder={
                                partnersResponse?.items.find((partner) => partner.id === categoryPartner.partnerId)?.name + " Komisyon O."
                              }
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
const formId = "updateCategoryForm";

interface Props {
  category: UpdateCategoryCommand;
  fetchCategories: () => void;
  partnersResponse: GetListResponse<GetListPartnerListItemDto>;
  partnersLoaded: boolean;
}
