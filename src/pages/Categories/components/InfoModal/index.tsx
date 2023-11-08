import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import CustomSpinner from "../../../../components/CustomSpinner";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import GetByIdCategoryResponse from "../../../../http/categories/models/queries/getById/getByIdCategoryResponse";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ category, partners, partnersLoaded }: Props) {
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const modalButtons: ButtonProps[] = [
    {
      key: "ok",
      variant: "primary",
      text: "Tamam",
      disabled: false,
      loading: false,
      handleClick: handleClose,
      icon: faCircleCheck,
    },
  ];

  return (
    <>
      <Button className="btn-sm ms-1" variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
      <CustomModal closable handleClose={handleClose} show={show} title="Kategori Detayı" buttons={modalButtons}>
        <Container>
          <Row>
            <Col md={12}>
              <FormGroup className="mb-3" controlId="infoCategoryModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={category.name} readOnly />
              </FormGroup>
            </Col>
            {partnersLoaded ? (
              partners?.items?.map((partner) => (
                <Col key={partner.id} md={6}>
                  <FormGroup className="mb-3" controlId={"infoCategoryModalPartnerInput-" + partner.id}>
                    <FormLabel>{partner.name} Komisyon O.</FormLabel>
                    <FormControl
                      placeholder={partner.name + "Komisyon O."}
                      value={category.categoryPartners?.find((cp) => cp.partnerId === partner.id)?.commissionRate ?? ""}
                      readOnly
                    />
                  </FormGroup>
                </Col>
              ))
            ) : (
              <CustomSpinner />
            )}
          </Row>
        </Container>
      </CustomModal>
    </>
  );
}

interface Props {
  category: GetByIdCategoryResponse;
  partners: GetListResponse<GetListPartnerListItemDto>;
  partnersLoaded: boolean;
}
